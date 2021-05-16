import GameStateDto from '../../../models/responses/game/state/GameStateDto';
import PlayerOnVacantPropertyEventPayload from '../../../models/responses/game/events/PlayerOnVacantPropertyEventPayload';
import WebSocketEventEnum from '../../../models/enums/WebSocketEventEnum';
import GameWebSocketUtils from '../utils/GameWebSocketUtils';

export default {
  dispatchEvent(
    gameState: GameStateDto,
    playerId: number,
    cellId: number
  ): void {
    const eventPayload: PlayerOnVacantPropertyEventPayload = {
      playerId,
      cellId,
    };

    GameWebSocketUtils.sendGameEventToAll(
      gameState,
      WebSocketEventEnum.PLAYER_ON_VACANT_PROPERTY,
      eventPayload
    );
  },
};
