import { Controller, Post, Route, Tags } from 'tsoa';
// import { StatusCodes } from 'http-status-codes';
import LobbyService from '../services/LobbyService';
import LobbyCreationResponseDto from '../models/responses/LobbyCreationResponseDto';
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
  public async registerLobby(): // @Body() lobbyRegistrationRequestDto: LobbyRegistrationRequestDto
  Promise<LobbyCreationResponseDto> {
    return this.lobbyService.createLobby();
  }
}
