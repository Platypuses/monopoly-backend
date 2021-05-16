import GameStateDto from '../../../models/responses/game/state/GameStateDto';
import PlayerDeclinePurchaseEventPayload from '../../../models/responses/game/events/PlayerDeclinePurchaseEventPayload';
import WebSocketEventEnum from '../../../models/enums/WebSocketEventEnum';
import GameWebSocketUtils from '../utils/GameWebSocketUtils';

export default {
  dispatchEvent(
    gameState: GameStateDto,
    playerId: number,
    cellId: number
  ): void {
    const eventPayload: PlayerDeclinePurchaseEventPayload = {
      playerId,
      cellId,
    };

    GameWebSocketUtils.sendGameEventToAll(
      gameState,
      WebSocketEventEnum.PLAYER_DECLINE_PURCHASE_OFFER,
      eventPayload
    );
  },
};
