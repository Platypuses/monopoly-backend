import WebSocketEventEnum from '../../../models/enums/WebSocketEventEnum';
import WebSocketService from '../../WebSocketService';
import GameStateDto from '../../../models/responses/game/state/GameStateDto';
import MoveToCellEventPayload from '../../../models/responses/game/events/MoveToCellEventPayload';

export default {
  dispatchEvent(gameState: GameStateDto, userId: number, cellId: number): void {
    const eventPayload: MoveToCellEventPayload = {
      userId,
      cellId,
    };

    const webSocketPayload = {
      event: WebSocketEventEnum.MOVE_TO_CELL,
      payload: eventPayload,
    };

    gameState.players.forEach((player) =>
      WebSocketService.send(player.playerId, webSocketPayload)
    );
  },
};
