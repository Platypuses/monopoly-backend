import GameStateDto from '../../../models/responses/game/state/GameStateDto';
import WebSocketEventEnum from '../../../models/enums/WebSocketEventEnum';
import PlayerAcceptPurchaseOfferEventPayload from '../../../models/responses/game/events/PlayerAcceptPurchaseOfferEventPayload';
import GameWebSocketUtils from '../utils/GameWebSocketUtils';

export default {
  dispatchEvent(
    gameState: GameStateDto,
    playerId: number,
    cellId: number
  ): void {
    const eventPayload: PlayerAcceptPurchaseOfferEventPayload = {
      playerId,
      cellId,
    };

    GameWebSocketUtils.sendGameEventToAll(
      gameState,
      WebSocketEventEnum.PLAYER_ACCEPT_PURCHASE_OFFER,
      eventPayload
    );
  },
};
