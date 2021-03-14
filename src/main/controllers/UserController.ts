import { Controller, Get, Post, Query, Route, Tags } from 'tsoa';
import { StatusCodes } from 'http-status-codes';
import UserService from '../services/UserService';
import User from '../models/entities/User';
import logger from '../config/logger';

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
    @Query() userName: string,
    @Query() password: string
  ): Promise<StatusCodes> {
    const user: User = await this.userService.createUser(
      userName.trim(),
      password.trim()
    );

    logger.info(`Created user '${user.nickname}' with id '${user.id}'.`);

    return StatusCodes.OK;
  }
}
