import GameStateDto from '../../../models/responses/game/state/GameStateDto';
import WebSocketEventEnum from '../../../models/enums/WebSocketEventEnum';
import WebSocketService from '../../WebSocketService';
import PlayerAcceptPurchaseOfferEventPayload from '../../../models/responses/game/events/PlayerAcceptPurchaseOfferEventPayload';

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

    const webSocketPayload = {
      event: WebSocketEventEnum.PLAYER_ACCEPT_PURCHASE_OFFER,
      payload: eventPayload,
    };

    gameState.players.forEach((player) =>
      WebSocketService.send(player.playerId, webSocketPayload)
    );
  },
};
