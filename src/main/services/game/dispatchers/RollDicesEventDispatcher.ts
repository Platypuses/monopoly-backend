import GameStateDto from '../../../models/responses/game/state/GameStateDto';
import RollDicesEventPayload from '../../../models/responses/game/events/RollDicesEventPayload';
import WebSocketEventEnum from '../../../models/enums/WebSocketEventEnum';
import GameWebSocketUtils from '../utils/GameWebSocketUtils';

const MIN_DICE_NUMBER = 1;
const MAX_DICE_NUMBER = 6;
const MAX_MINUS_MIN = MAX_DICE_NUMBER - MIN_DICE_NUMBER;

function generateDiceNumber() {
  return Math.floor(Math.random() * (MAX_MINUS_MIN + 1)) + MIN_DICE_NUMBER;
}

export default {
  dispatchEvent(gameState: GameStateDto): void {
    const firstDiceNumber = generateDiceNumber();
    const secondDiceNumber = generateDiceNumber();

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
