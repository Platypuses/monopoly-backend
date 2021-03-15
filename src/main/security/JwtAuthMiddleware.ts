import express from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { ACCESS_TOKEN_HEADER } from '../config/appConfigProperties';
import ClientError from '../models/error/ClientError';
import TokenService from '../services/TokenService';
import AuthenticatedUserDto from '../models/requests/AuthenticatedUserDto';

/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line import/prefer-default-export
export async function expressAuthentication(
  request: express.Request,
  _securityName: string,
  _scopes?: string[]
): Promise<AuthenticatedUserDto> {
  const accessToken = request.header(ACCESS_TOKEN_HEADER);

  if (accessToken === undefined) {
    throw new ClientError(ReasonPhrases.UNAUTHORIZED, StatusCodes.UNAUTHORIZED);
  }

  const tokenPayload = await TokenService.parseAccessToken(accessToken);
  return { id: tokenPayload.userId };
}

export interface RequestWithUser {
  user: AuthenticatedUserDto;
}
