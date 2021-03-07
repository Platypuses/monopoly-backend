import {
  Body, Controller, Get, Path, Post, Route, Tags,
} from 'tsoa';
import UserRequestDto from '../models/requests/UserRequestDto';
import UserResponseDto from '../models/responses/UserResponseDto';
import logger from '../config/logger';
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
