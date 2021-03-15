import { Body, Controller, Get, Post, Route, Tags } from 'tsoa';
import UserService from '../services/UserService';
import UserRegistrationRequestDto from '../models/requests/UserRegistrationRequestDto';

@Route('/api/v1/users')
@Tags('User Controller')
// eslint-disable-next-line import/prefer-default-export
export class UserController extends Controller {
  private readonly userService;

  constructor() {
    super();
    this.userService = UserService;
  }

  @Get()
  public async test(): Promise<string> {
    return this.userService.test();
  }

  @Post()
  public async registerUser(
    @Body() userRegistrationRequestDto: UserRegistrationRequestDto
  ): Promise<void> {
    await this.userService.createUser(userRegistrationRequestDto);
  }
}
