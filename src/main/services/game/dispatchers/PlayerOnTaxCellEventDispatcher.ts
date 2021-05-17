import WebSocketEventEnum from '../../../models/enums/WebSocketEventEnum';
import GameStateDto from '../../../models/responses/game/state/GameStateDto';
import PlayerOnChanceCellEventPayload from '../../../models/responses/game/events/PlayerOnChanceCellEventPayload';
import GameWebSocketUtils from '../utils/GameWebSocketUtils';

export default {
  dispatchEvent(
    gameState: GameStateDto,
    userId: number,
    cellId: number,
    description: string
  ): void {
    const eventPayload: PlayerOnChanceCellEventPayload = {
      userId,
      cellId,
      description,
    };

    GameWebSocketUtils.sendGameEventToAll(
      gameState,
      WebSocketEventEnum.PLAYER_ON_TAX_CELL,
      eventPayload
    );
  },
};
