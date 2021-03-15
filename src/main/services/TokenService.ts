import parseJwk from 'jose/jwk/parse';
import SignJWT, { JWTPayload } from 'jose/jwt/sign';
import { getRepository, Repository } from 'typeorm';
import { StatusCodes } from 'http-status-codes';
import jwtVerify from 'jose/jwt/verify';
import { JWTVerifyResult } from 'jose/webcrypto/types';
import {
  ACCESS_TOKEN_LIFETIME,
  ACCESS_TOKEN_SIGN_KEY,
  REFRESH_TOKEN_LIFETIME,
  REFRESH_TOKEN_SIGN_KEY,
} from '../config/appConfigProperties';
import TokensPairResponseDto from '../models/responses/TokensPairResponseDto';
import logger from '../config/logger';
import RefreshToken from '../models/entities/RefreshToken';
import ClientError from '../models/error/ClientError';

const INVALID_REFRESH_TOKEN_ERROR = 'Недействительный refresh-токен';
const TOKEN_VERIFICATION_FAILED_ERROR = 'Ошибка проверки токена';
const JWT_ALGORITHM = 'HS512';

async function generateToken(
  signKey: string,
  tokenPayload: JWTPayload,
  tokenLifetime: string
): Promise<string> {
  const tokenJwk = await parseJwk({
    alg: JWT_ALGORITHM,
    kty: 'oct',
    k: signKey,
  });

  return new SignJWT(tokenPayload)
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(tokenLifetime)
    .sign(tokenJwk);
}

async function saveRefreshToken(
  refreshToken: string,
  userId: number
): Promise<void> {
  await getRepository(RefreshToken).save({
    value: refreshToken,
    user: { id: userId },
  });
}

async function verifyToken(
  token: string,
  signKey: string
): Promise<JWTVerifyResult> {
  const tokenJwk = await parseJwk({
    alg: JWT_ALGORITHM,
    kty: 'oct',
    k: signKey,
  });

  try {
    return await jwtVerify(token, tokenJwk);
  } catch (e) {
    throw new ClientError(
      TOKEN_VERIFICATION_FAILED_ERROR,
      StatusCodes.UNAUTHORIZED
    );
  }
}

async function verifyRefreshToken(refreshToken: string) {
  try {
    await verifyToken(refreshToken, REFRESH_TOKEN_SIGN_KEY);
  } catch (e) {
    await getRepository(RefreshToken).delete({ value: refreshToken });
    throw e;
  }
}

async function getRefreshTokenEntity(
  tokenRepository: Repository<RefreshToken>,
  refreshToken: string
) {
  const refreshTokenEntity = await tokenRepository.findOne({
    where: { value: refreshToken },
  });

  if (refreshTokenEntity === undefined) {
    throw new ClientError(
      INVALID_REFRESH_TOKEN_ERROR,
      StatusCodes.UNAUTHORIZED
    );
  }

  return refreshTokenEntity;
}

export default {
  async generateTokens(userId: number): Promise<TokensPairResponseDto> {
    const accessToken = await generateToken(
      ACCESS_TOKEN_SIGN_KEY,
      { userId },
      ACCESS_TOKEN_LIFETIME
    );

    const refreshToken = await generateToken(
      REFRESH_TOKEN_SIGN_KEY,
      {},
      REFRESH_TOKEN_LIFETIME
    );

    await saveRefreshToken(refreshToken, userId);

    logger.info(`Generating tokens pair for user with id ${userId}`);

    return {
      accessToken,
      refreshToken,
    };
  },

  async parseAccessToken(token: string): Promise<JWTPayload> {
    const verifyResult = await verifyToken(token, ACCESS_TOKEN_SIGN_KEY);
    return verifyResult.payload;
  },

  async generateTokensByRefreshToken(
    refreshToken: string
  ): Promise<TokensPairResponseDto> {
    await verifyRefreshToken(refreshToken);
    const tokenRepository = getRepository(RefreshToken);

    const refreshTokenEntity = await getRefreshTokenEntity(
      tokenRepository,
      refreshToken
    );

    const userId = refreshTokenEntity.user.id;
    await tokenRepository.remove(refreshTokenEntity);

    logger.info(`Refreshing tokens pair for user with id ${userId}`);

    return this.generateTokens(userId);
  },
};
