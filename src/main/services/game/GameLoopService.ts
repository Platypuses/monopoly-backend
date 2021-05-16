import GameStateDto from '../../models/responses/game/state/GameStateDto';
import RollDicesEventDispatcher from './dispatchers/RollDicesEventDispatcher';
import PlayerBalanceChangeEventDispatcher from './dispatchers/PlayerBalanceChangeEventDispatcher';

async function testRollDices(gameState: GameStateDto) {
  await RollDicesEventDispatcher.dispatchEvent(gameState);
}

async function testBalanceChange(gameState: GameStateDto) {
  const randomBalanceDelta = Math.floor(Math.random() * 201) - 100;
  await PlayerBalanceChangeEventDispatcher.dispatchEvent(
    gameState,
    gameState.players[0].playerId,
    randomBalanceDelta
  );
}

export default {
  run(gameState: GameStateDto): void {
    setInterval(async () => testRollDices(gameState), 3000);
    setInterval(async () => testBalanceChange(gameState), 5000);
  },
};
