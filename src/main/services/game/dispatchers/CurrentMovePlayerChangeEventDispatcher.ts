import WebSocketEventEnum from '../../../models/enums/WebSocketEventEnum';
import CurrentMovePlayerChangeEventPayload from '../../../models/responses/game/events/CurrentMovePlayerChangeEventPayload';
import GameStateDto from '../../../models/responses/game/state/GameStateDto';
import GameWebSocketUtils from '../utils/GameWebSocketUtils';

export default {
  dispatchEvent(gameState: GameStateDto, userId: number): void {
    const eventPayload: CurrentMovePlayerChangeEventPayload = {
      userId,
    };

    GameWebSocketUtils.sendGameEventToAll(
      gameState,
      WebSocketEventEnum.CURRENT_MOVE_PLAYER_CHANGE,
      eventPayload
    );
  },
};
