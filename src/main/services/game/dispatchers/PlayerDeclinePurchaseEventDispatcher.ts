import GameStateDto from '../../../models/responses/game/state/GameStateDto';
import PlayerDeclinePurchaseEventPayload from '../../../models/responses/game/events/PlayerDeclinePurchaseEventPayload';
import WebSocketEventEnum from '../../../models/enums/WebSocketEventEnum';
import WebSocketService from '../../WebSocketService';

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

    const webSocketPayload = {
      event: WebSocketEventEnum.PLAYER_DECLINE_PURCHASE_OFFER,
      payload: eventPayload,
    };

    gameState.players.forEach((player) =>
      WebSocketService.send(player.playerId, webSocketPayload)
    );
  },
};
