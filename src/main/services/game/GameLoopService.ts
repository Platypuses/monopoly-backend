import GameStateDto from '../../models/responses/game/state/GameStateDto';
import RollDicesEventDispatcher from './dispatchers/RollDicesEventDispatcher';
import PlayerBalanceChangeEventDispatcher from './dispatchers/PlayerBalanceChangeEventDispatcher';
import ClientError from '../../models/error/ClientError';
import GameService from './GameService';
import logger from '../../config/logger';

const GAME_IS_NOT_RUNNING = 'Игра не запущена';
const SAVE_STATE_INTERVAL = 30000;

const gamesStatesMap = new Map<number, GameStateDto>();

function testBalanceChange(gameState: GameStateDto) {
  const randomBalanceDelta = Math.floor(Math.random() * 201) - 100;
  PlayerBalanceChangeEventDispatcher.dispatchEvent(
    gameState,
    gameState.players[0].playerId,
    randomBalanceDelta
  );
}

async function saveGameStateToDatabase(
  gameId: number,
  interval: NodeJS.Timeout
) {
  const gameState = gamesStatesMap.get(gameId);

  if (gameState === undefined) {
    clearInterval(interval);
    logger.info(
      `Stopped saving game state to database for game with id ${gameId}`
    );
    return;
  }

  await GameService.saveGameState(gameState);
}

export default {
  start(gameState: GameStateDto): void {
    gamesStatesMap.set(gameState.gameId, gameState);

    const interval: NodeJS.Timeout = setInterval(
      async () => saveGameStateToDatabase(gameState.gameId, interval),
      SAVE_STATE_INTERVAL
    );

    setInterval(() => testBalanceChange(gameState), 5000);
  },

  stop(gameId: number): void {
    gamesStatesMap.delete(gameId);
  },

  getState(gameId: number): GameStateDto {
    const gameState = gamesStatesMap.get(gameId);

    if (gameState === undefined) {
      throw new ClientError(GAME_IS_NOT_RUNNING);
    }

    return gameState;
  },

  rollDices(gameState: GameStateDto): void {
    RollDicesEventDispatcher.dispatchEvent(gameState);
  },
};
