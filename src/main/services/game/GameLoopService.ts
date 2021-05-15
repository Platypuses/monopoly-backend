import GameStateDto from '../../models/responses/game/state/GameStateDto';
import RollDicesEventHandler from './handlers/RollDicesEventHandler';

async function test(gameState: GameStateDto) {
  await RollDicesEventHandler.handleEvent(gameState);
}

export default {
  run(gameState: GameStateDto): void {
    setInterval(async () => test(gameState), 3000);
  },
};
