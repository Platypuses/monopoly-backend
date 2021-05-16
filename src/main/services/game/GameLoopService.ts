import GameStateDto from '../../models/responses/game/state/GameStateDto';
import RollDicesEventDispatcher from './dispatchers/RollDicesEventDispatcher';

async function test(gameState: GameStateDto) {
  await RollDicesEventDispatcher.dispatchEvent(gameState);
}

export default {
  run(gameState: GameStateDto): void {
    setInterval(async () => test(gameState), 3000);
  },
};
