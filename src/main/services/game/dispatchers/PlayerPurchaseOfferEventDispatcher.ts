import PlayerPurchaseOfferEventPayload from '../../../models/responses/game/events/PlayerPurchaseOfferEventPayload';
import WebSocketEventEnum from '../../../models/enums/WebSocketEventEnum';
import GameWebSocketUtils from '../utils/GameWebSocketUtils';

export default {
  dispatchEvent(playerId: number, cellId: number): void {
    const eventPayload: PlayerPurchaseOfferEventPayload = {
      cellId,
    };

    GameWebSocketUtils.sendGameEvent(
      playerId,
      WebSocketEventEnum.PROPERTY_PURCHASE_OFFER,
      eventPayload
    );
  },
};
