import GameStateDto from '../../../models/responses/game/state/GameStateDto';
import StartOfTheGameEventPayload from '../../../models/responses/game/events/StartOfTheGameEventPayload';
import GameWebSocketUtils from '../utils/GameWebSocketUtils';
import WebSocketEventEnum from '../../../models/enums/WebSocketEventEnum';

export default {
  dispatchEvent(gameState: GameStateDto): void {
    const eventPayload: StartOfTheGameEventPayload = {
      gameId: gameState.gameId,
    };

    GameWebSocketUtils.sendGameEventToAll(
      gameState,
      WebSocketEventEnum.START_OF_THE_GAME,
      eventPayload
    );
  },
};
