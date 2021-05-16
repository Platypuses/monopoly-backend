import WebSocketEventEnum from '../../../models/enums/WebSocketEventEnum';
import GameStateDto from '../../../models/responses/game/state/GameStateDto';
import MoveToCellEventPayload from '../../../models/responses/game/events/MoveToCellEventPayload';
import GameWebSocketUtils from '../utils/GameWebSocketUtils';

export default {
  dispatchEvent(gameState: GameStateDto, userId: number, cellId: number): void {
    const eventPayload: MoveToCellEventPayload = {
      userId,
      cellId,
    };

    GameWebSocketUtils.sendGameEventToAll(
      gameState,
      WebSocketEventEnum.MOVE_TO_CELL,
      eventPayload
    );
  },
};
