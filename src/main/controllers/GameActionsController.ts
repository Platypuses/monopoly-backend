import { Controller, Post, Request, Route, Security, Tags } from 'tsoa';
import { StatusCodes } from 'http-status-codes';
import GameActionsService from '../services/game/GameActionsService';
import { RequestWithUser } from '../security/JwtAuthMiddleware';

@Route('/api/v1/game-actions')
@Tags('Game Actions Controller')
// eslint-disable-next-line import/prefer-default-export
export class GameActionsController extends Controller {
  private readonly gameActionsService: typeof GameActionsService;

  constructor() {
    super();
    this.gameActionsService = GameActionsService;
  }

  @Post('/dices')
  @Security('JWT')
  public async rollDices(@Request() request: RequestWithUser): Promise<void> {
    await this.gameActionsService.rollDices(request.user.id);
    this.setStatus(StatusCodes.OK);
  }

  @Post('/purchase-declining')
  @Security('JWT')
  public async declinePurchase(
    @Request() request: RequestWithUser
  ): Promise<void> {
    await this.gameActionsService.declinePurchase(request.user.id);
    this.setStatus(StatusCodes.OK);
  }
}
