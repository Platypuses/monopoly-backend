import { Body, Controller, Get, Post, Query, Route, Tags } from 'tsoa';
import RefreshTokensPairRequestDto from '../models/requests/RefreshTokensPairRequestDto';
import UserAuthorizationRequestDto from '../models/requests/UserAuthorizationRequestDto';
import TokensPairResponseDto from '../models/responses/TokensPairResponseDto';
import TokenService from '../services/TokenService';
import UserService from '../services/UserService';

@Route('/api/v1/auth')
@Tags('Auth Controller')
// eslint-disable-next-line import/prefer-default-export
export class AuthController extends Controller {
  private readonly tokenService;

  private readonly userService;

  constructor() {
    super();
    this.tokenService = TokenService;
    this.userService = UserService;
  }

  @Post()
  public async authorizeUserByNicknameAndPassword(
    @Body() requestDto: UserAuthorizationRequestDto
  ): Promise<TokensPairResponseDto> {
    const user = await this.userService.getUserByNicknameAndPassword(
      requestDto
    );

    let tokensPairDto: TokensPairResponseDto;
    if (user.refreshTokens) {
      const refreshToken = user.refreshTokens[0].value;
      tokensPairDto = await this.tokenService.generateTokensByRefreshToken(
        refreshToken
      );
    } else {
      tokensPairDto = await this.tokenService.generateTokens(user.id);
    }

    return tokensPairDto;
  }

  @Get('/tokens-pair')
  public async getTokensPair(
    @Query() userId: number
  ): Promise<TokensPairResponseDto> {
    return this.tokenService.generateTokens(userId);
  }

  @Post('/tokens-renewal')
  public async generateTokensByRefreshToken(
    @Body() requestDto: RefreshTokensPairRequestDto
  ): Promise<TokensPairResponseDto> {
    const { refreshToken } = requestDto;
    return this.tokenService.generateTokensByRefreshToken(refreshToken);
  }
}
