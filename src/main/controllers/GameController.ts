import {
  Controller,
  Delete,
  Get,
  Path,
  Post,
  Request,
  Route,
  Security,
  Tags,
} from 'tsoa';
import { StatusCodes } from 'http-status-codes';
import GameService from '../services/game/GameService';
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

  @Delete()
  @Security('JWT')
  public async stopGame(@Request() request: RequestWithUser): Promise<void> {
    await this.gameService.stopGame(request.user.id);
    this.setStatus(StatusCodes.OK);
  }

  @Get('/{gameId}')
  @Security('JWT')
  public getGameState(@Path() gameId: number): GameStateDto {
    return this.gameService.getGameState(gameId);
  }
}
