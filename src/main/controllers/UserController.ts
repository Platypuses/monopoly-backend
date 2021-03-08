import { Controller, Get, Route, Tags } from 'tsoa';
import UserService from '../services/UserService';

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
    return this.userService.toString();
  }
}
