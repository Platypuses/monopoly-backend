import GameStateDto from '../../../models/responses/game/state/GameStateDto';
import WebSocketEventEnum from '../../../models/enums/WebSocketEventEnum';
import PlayerBalanceChangeEventPayload from '../../../models/responses/game/events/PlayerBalanceChangeEventPayload';
import GameWebSocketUtils from '../utils/GameWebSocketUtils';

export default {
  dispatchEvent(
    gameState: GameStateDto,
    playerId: number,
    balanceDelta: number
  ): void {
    const eventPayload: PlayerBalanceChangeEventPayload = {
      playerId,
      balanceDelta,
    };

    GameWebSocketUtils.sendGameEventToAll(
      gameState,
      WebSocketEventEnum.PLAYER_BALANCE_CHANGE,
      eventPayload
    );
  },
};
