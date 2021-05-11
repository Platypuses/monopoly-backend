import {
  Controller,
  Post,
  Request,
  Route,
  Security,
  Tags,
  Delete,
  Path,
} from 'tsoa';
// import { StatusCodes } from 'http-status-codes';
import { StatusCodes } from 'http-status-codes';
import LobbyService from '../services/LobbyService';
import LobbyCreationResponseDto from '../models/responses/LobbyCreationResponseDto';
import { RequestWithUser } from '../security/JwtAuthMiddleware';

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
  ): Promise<LobbyCreationResponseDto> {
    return this.lobbyService.createLobby(request.user.id);
  }

  @Delete('{lobbyId}')
  @Security('JWT')
  public async dissolveLobby(
    @Path() lobbyId: number,
    @Request() request: RequestWithUser
  ): Promise<void> {
    await this.lobbyService.deleteLobby(lobbyId, request.user.id);
    this.setStatus(StatusCodes.OK);
  }
}
