import {
  Body, Controller, Get, Path, Post, Route, Tags,
} from 'tsoa';
import UserRequestDto from '../models/request/UserRequestDto';
import UserResponseDto from '../models/response/UserResponseDto';
import UserService from '../services/UserService';
import logger from '../config/logger';
import { userService } from '../di/DIContainer';

@Route('/api/v1/users')
@Tags('User Controller')
// eslint-disable-next-line import/prefer-default-export
export class UserController extends Controller {
  private readonly userService: UserService;

  constructor() {
    super();
    this.userService = userService;
  }

  @Post()
  public async createUser(@Body() userRequestDto: UserRequestDto): Promise<UserResponseDto> {
    const userResponseDto = await this.userService.createUser(userRequestDto);
    logger.info(`Created user with id ${userResponseDto.id}`);

    return userResponseDto;
  }

  @Get('/{userId}')
  public async getUser(@Path() userId: number): Promise<UserResponseDto> {
    const userResponseDto = await this.userService.getUser(userId);
    logger.info(`Getting user with id ${userResponseDto.id}`);

    return userResponseDto;
  }
}
