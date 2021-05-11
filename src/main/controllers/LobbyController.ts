import { Controller, Post, Request, Route, Security, Tags } from 'tsoa';
// import { StatusCodes } from 'http-status-codes';
import LobbyService from '../services/LobbyService';
import LobbyCreationResponseDto from '../models/responses/LobbyCreationResponseDto';
import { RequestWithUser } from '../security/JwtAuthMiddleware';
// import UserRegistrationRequestDto from '../models/requests/UserRegistrationRequestDto';
// import { RequestWithUser } from '../security/JwtAuthMiddleware';
// import UserResponseDto from '../models/responses/UserResponseDto';
// import UserNicknameCheckDto from '../models/responses/UserNicknameCheckDto';

@Route('/api/v1/lobbies')
@Tags('Lobby Controller')
// eslint-disable-next-line import/prefer-default-export
export class LobbyController extends Controller {
  private readonly lobbyService;

  constructor() {
    super();
    this.lobbyService = LobbyService;
  }

  @Post()
  @Security('JWT')
  public async registerLobby(
    @Request() request: RequestWithUser
  ): // @Body() lobbyRegistrationRequestDto: LobbyRegistrationRequestDto
  Promise<LobbyCreationResponseDto> {
    return this.lobbyService.createLobby(request.user.id);
  }
}
