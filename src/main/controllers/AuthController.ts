import { Body, Controller, Post, Route, Tags } from 'tsoa';
import RefreshTokensPairRequestDto from '../models/requests/RefreshTokensPairRequestDto';
import TokensPairResponseDto from '../models/responses/TokensPairResponseDto';
import TokenService from '../services/TokenService';

@Route('/api/v1/auth')
@Tags('Auth Controller')
// eslint-disable-next-line import/prefer-default-export
export class AuthController extends Controller {
  private readonly tokenService;

  constructor() {
    super();
    this.tokenService = TokenService;
  }

  @Post('/tokens-renewal')
  public async generateTokensByRefreshToken(
    @Body() requestDto: RefreshTokensPairRequestDto
  ): Promise<TokensPairResponseDto> {
    const { refreshToken } = requestDto;
    return this.tokenService.generateTokensByRefreshToken(refreshToken);
  }
}
