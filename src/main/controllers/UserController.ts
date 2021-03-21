import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Route,
  Security,
  Tags,
  Query,
} from 'tsoa';
import { StatusCodes } from 'http-status-codes';
import UserService from '../services/UserService';
import UserRegistrationRequestDto from '../models/requests/UserRegistrationRequestDto';
import { RequestWithUser } from '../security/JwtAuthMiddleware';
import UserResponseDto from '../models/responses/UserResponseDto';
import UserNicknameCheckDto from '../models/responses/UserNicknameCheckDto';

@Route('/api/v1/users')
@Tags('User Controller')
// eslint-disable-next-line import/prefer-default-export
export class UserController extends Controller {
  private readonly userService;

  constructor() {
    super();
    this.userService = UserService;
  }

  @Get('/me')
  @Security('JWT')
  public async getAuthenticatedUser(
    @Request() request: RequestWithUser
  ): Promise<UserResponseDto> {
    return this.userService.getUser(request.user.id);
  }

  @Get('/nickname-check')
  public async checkUserNickname(
    @Query() nickname: string
  ): Promise<UserNicknameCheckDto> {
    return this.userService.getIsUserExists(nickname);
  }

  @Post()
  public async registerUser(
    @Body() userRegistrationRequestDto: UserRegistrationRequestDto
  ): Promise<void> {
    await this.userService.createUser(userRegistrationRequestDto);
    this.setStatus(StatusCodes.OK);
  }
}
