import PlayerPurchaseOfferEventPayload from '../../../models/responses/game/events/PlayerPurchaseOfferEventPayload';
import WebSocketEventEnum from '../../../models/enums/WebSocketEventEnum';
import WebSocketService from '../../WebSocketService';

export default {
  dispatchEvent(playerId: number, cellId: number): void {
    const eventPayload: PlayerPurchaseOfferEventPayload = {
      cellId,
    };

    const webSocketPayload = {
      event: WebSocketEventEnum.PROPERTY_PURCHASE_OFFER,
      payload: eventPayload,
    };

    WebSocketService.send(playerId, webSocketPayload);
  },
};
