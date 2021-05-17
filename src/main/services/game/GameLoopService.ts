import GameStateDto from '../../models/responses/game/state/GameStateDto';
import GameCellDto from '../../models/responses/game/state/GameCellDto';
import RollDicesEventDispatcher from './dispatchers/RollDicesEventDispatcher';
import ClientError from '../../models/error/ClientError';
import GameService from './GameService';
import logger from '../../config/logger';
import PlayerDeclinePurchaseEventDispatcher from './dispatchers/PlayerDeclinePurchaseEventDispatcher';
import MoveToCellEventDispatcher from './dispatchers/MoveToCellEventDispatcher';
import CurrentMovePlayerChangeEventDispatcher from './dispatchers/CurrentMovePlayerChangeEventDispatcher';
import PlayerDto from '../../models/responses/game/state/PlayerDto';
import PlayerAcceptPurchaseEventDispatcher from './dispatchers/PlayerAcceptPurchaseEventDispatcher';
import PlayerBalanceChangeEventDispatcher from './dispatchers/PlayerBalanceChangeEventDispatcher';
import CellType from '../../models/enums/CellType';
import MoveService from './MoveService';

const GAME_IS_NOT_RUNNING = 'Игра не запущена';
const PLAYER_NOT_FOUND = 'Игрок не найден';
const CELL_NOT_FOUND = 'Клетка не найдена';
const SAVE_STATE_INTERVAL = 30000;

const REWARD_FOR_PASSING_START_CELL = 200;

const gamesStatesMap = new Map<number, GameStateDto>();

const MIN_DICE_NUMBER = 1;
const MAX_DICE_NUMBER = 6;
const MAX_MINUS_MIN = MAX_DICE_NUMBER - MIN_DICE_NUMBER;

function generateDiceNumber() {
  return Math.floor(Math.random() * (MAX_MINUS_MIN + 1)) + MIN_DICE_NUMBER;
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

function getCurrentPlayer(gameState: GameStateDto): PlayerDto {
  const index = gameState.players.findIndex(
    (player) => player.playerId === gameState.currentMovePlayerId
  );

  return gameState.players[index];
}

function getNextPlayerId(gameState: GameStateDto): number {
  const currentPlayerIndex = gameState.players.findIndex(
    (player) => player.playerId === gameState.currentMovePlayerId
  );

  let nextPlayerIndex;
  if (currentPlayerIndex === gameState.players.length - 1) {
    nextPlayerIndex = 0;
  } else {
    nextPlayerIndex = currentPlayerIndex + 1;
  }

  const { playerId: nextPlayerUserId } = gameState.players[nextPlayerIndex];

  return nextPlayerUserId;
}

function getCellByCellId(gameState: GameStateDto, cellId: number): GameCellDto {
  const cellById = gameState.cells.find((cell) => cell.cellId === cellId);
  if (cellById === undefined) {
    throw new ClientError(CELL_NOT_FOUND);
  }
  return cellById;
}

export default {
  start(gameState: GameStateDto): void {
    gamesStatesMap.set(gameState.gameId, gameState);

    const interval: NodeJS.Timeout = setInterval(
      async () => saveGameStateToDatabase(gameState.gameId, interval),
      SAVE_STATE_INTERVAL
    );

    // setInterval(() => testBalanceChange(gameState), 5000);
    CurrentMovePlayerChangeEventDispatcher.dispatchEvent(
      gameState,
      gameState.currentMovePlayerId
    );
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

  getNextCellId(gameState: GameStateDto, cellId: number, move: number): number {
    let nextCellId = cellId + move;

    // прохождение через клетку вперед
    if (nextCellId > 40) {
      nextCellId = (nextCellId % 40) + 1;
      PlayerBalanceChangeEventDispatcher.dispatchEvent(
        gameState,
        gameState.currentMovePlayerId,
        REWARD_FOR_PASSING_START_CELL
      );
    }

    return nextCellId;
  },

  moveToCell(gameState: GameStateDto, nextCellId: number): void {
    const player = getCurrentPlayer(gameState);
    player.cellId = nextCellId;

    MoveToCellEventDispatcher.dispatchEvent(
      gameState,
      gameState.currentMovePlayerId,
      nextCellId
    );

    const cell = getCellByCellId(gameState, nextCellId);
    switch (cell.cellType) {
      case CellType.START:
        break;
      case CellType.PROPERTY:
        MoveService.moveToPropertyCell(gameState, cell);
        break;
      case CellType.CHANCE:
        MoveService.moveToChanceCell(gameState, cell);
        break;
      case CellType.TAX:
        MoveService.moveToTaxCell(gameState, cell);
        break;
      case CellType.CORNER:
        break;
      default:
        break;
    }
  },

  changeCurrentMovePlayer(gameState: GameStateDto): void {
    const currentGameState = this.getState(gameState.gameId);
    currentGameState.currentMovePlayerId = getNextPlayerId(gameState);

    CurrentMovePlayerChangeEventDispatcher.dispatchEvent(
      currentGameState,
      currentGameState.currentMovePlayerId
    );
  },

  rollDices(gameState: GameStateDto): number {
    const firstDiceNumber = generateDiceNumber();
    const secondDiceNumber = generateDiceNumber();

    RollDicesEventDispatcher.dispatchEvent(
      gameState,
      firstDiceNumber,
      secondDiceNumber
    );

    return firstDiceNumber + secondDiceNumber;
  },

  acceptPurchase(gameState: GameStateDto): void {
    const playerId = gameState.currentMovePlayerId;

    const cellId = this.getCellIdByPlayerId(gameState, playerId);
    const cell = getCellByCellId(gameState, cellId);
    cell.ownerId = playerId;

    // eslint-disable-next-line no-param-reassign
    gameState.currentMovePlayerId = getNextPlayerId(gameState);

    PlayerAcceptPurchaseEventDispatcher.dispatchEvent(
      gameState,
      playerId,
      cellId
    );
  },

  declinePurchase(gameState: GameStateDto): void {
    const playerId = gameState.currentMovePlayerId;
    const cellId = this.getCellIdByPlayerId(gameState, playerId);

    // eslint-disable-next-line no-param-reassign
    gameState.currentMovePlayerId = getNextPlayerId(gameState);

    PlayerDeclinePurchaseEventDispatcher.dispatchEvent(
      gameState,
      playerId,
      cellId
    );
  },

  getCellIdByPlayerId(gameState: GameStateDto, playerId: number): number {
    const playerById = gameState.players.find(
      (player) => player.playerId === playerId
    );

    if (playerById === undefined) {
      throw new ClientError(PLAYER_NOT_FOUND);
    }
    const { cellId } = playerById;

    return cellId;
  },

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  getOwnerIdByCellId(gameState: GameStateDto, cellId: number) {
    const cellById = getCellByCellId(gameState, cellId);
    return cellById.ownerId;
  },
};
