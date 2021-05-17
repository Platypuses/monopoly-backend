import GameStateDto from '../../../models/responses/game/state/GameStateDto';
import RollDicesEventPayload from '../../../models/responses/game/events/RollDicesEventPayload';
import WebSocketEventEnum from '../../../models/enums/WebSocketEventEnum';
import GameWebSocketUtils from '../utils/GameWebSocketUtils';

export default {
  dispatchEvent(
    gameState: GameStateDto,
    firstDiceNumber: number,
    secondDiceNumber: number
  ): void {
    const eventPayload: RollDicesEventPayload = {
      playerId: gameState.currentMovePlayerId,
      firstDiceNumber,
      secondDiceNumber,
    };

    GameWebSocketUtils.sendGameEventToAll(
      gameState,
      WebSocketEventEnum.ROLL_DICES,
      eventPayload
    );
  },
};
