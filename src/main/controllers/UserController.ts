import { Controller, Get, Route, Tags } from 'tsoa';
import UserService from '../services/UserService';
import TokensPairResponseDto from '../models/responses/TokensPairResponseDto';
import TokenService from '../services/TokenService';

@Route('/api/v1/users')
@Tags('User Controller')
// eslint-disable-next-line import/prefer-default-export
export class UserController extends Controller {
  private readonly userService;

  private readonly tokenService;

  constructor() {
    super();
    this.userService = UserService;
    this.tokenService = TokenService;
  }

  @Get()
  public async test(): Promise<string> {
    return this.userService.test();
  }

  @Get('tokens')
  public async testTokens(): Promise<TokensPairResponseDto> {
    return this.tokenService.generateTokens(1);
  }
}
