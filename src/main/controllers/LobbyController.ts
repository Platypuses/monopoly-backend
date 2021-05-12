import {
  Controller,
  Post,
  Request,
  Route,
  Security,
  Tags,
  Path,
  Delete,
} from 'tsoa';
import { StatusCodes } from 'http-status-codes';
import LobbyService from '../services/LobbyService';
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

  @Post('{lobbyId}/participants')
  @Security('JWT')
  public async joinLobby(
    @Path() lobbyId: number,
    @Request() request: RequestWithUser
  ): Promise<void> {
    await this.lobbyService.createLobbyParticipant(lobbyId, request.user.id);
    this.setStatus(StatusCodes.OK);
  }

  @Delete('/lobby-participant')
  @Security('JWT')
  public async leaveLobby(@Request() request: RequestWithUser): Promise<void> {
    await this.lobbyService.deleteLobbyParticipant(request.user.id);
    this.setStatus(StatusCodes.OK);
  }
}
