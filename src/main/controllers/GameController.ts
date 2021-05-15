import {
  Controller,
  Get,
  Path,
  Post,
  Request,
  Route,
  Security,
  Tags,
} from 'tsoa';
import GameService from '../services/GameService';
import { RequestWithUser } from '../security/JwtAuthMiddleware';
import GameStateDto from '../models/responses/game/state/GameStateDto';

@Route('/api/v1/game')
@Tags('Game Controller')
// eslint-disable-next-line import/prefer-default-export
export class GameController extends Controller {
  private readonly gameService: typeof GameService;

  constructor() {
    super();
    this.gameService = GameService;
  }

  @Post()
  @Security('JWT')
  public async startGame(
    @Request() request: RequestWithUser
  ): Promise<GameStateDto> {
    return this.gameService.startGame(request.user.id);
  }

  @Get('/{gameId}')
  @Security('JWT')
  public async getGameState(@Path() gameId: number): Promise<GameStateDto> {
    return this.gameService.getGameState(gameId);
  }
}
