import { Body, Controller, Get, Post, Route, Tags } from 'tsoa';
import UserService from '../services/UserService';
import UserRequestDto from '../models/requests/UserRequestDto';

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
    @Body() userRequestDto: UserRequestDto
  ): Promise<void> {
    return this.userService.createUser(userRequestDto);
  }
}
