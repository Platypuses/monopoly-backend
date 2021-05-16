import GameStateDto from '../../../models/responses/game/state/GameStateDto';
import RollDicesEventPayload from '../../../models/responses/game/events/RollDicesEventPayload';
import WebSocketEventEnum from '../../../models/enums/WebSocketEventEnum';
import WebSocketService from '../../WebSocketService';

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

    const webSocketPayload = {
      event: WebSocketEventEnum.ROLL_DICES,
      payload: eventPayload,
    };

    gameState.players.forEach((player) =>
      WebSocketService.send(player.playerId, webSocketPayload)
    );
  },
};
