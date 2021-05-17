import GameLoopService from './GameLoopService';
import GameStateDto from '../../models/responses/game/state/GameStateDto';
import ClientError from '../../models/error/ClientError';
import LobbyService from '../LobbyService';

const NO_ACTIVE_GAME = 'Не найдено активных игр';
const YOU_ARE_NOT_GAME_PARTICIPANT = 'Вы не участник игры';
const NOT_YOUR_MOVE = 'Не ваш ход';
const CELL_NOT_FREE = 'Клетка уже находится в собственности';

function isUserNotInGame(gameState: GameStateDto, userId: number): boolean {
  let checkResult = true;

  for (let i = 0; i < gameState.players.length; i++) {
    const player = gameState.players[i];

    if (player.playerId === userId) {
      checkResult = false;
      break;
    }
  }

  return checkResult;
}

function isUserNotCurrentMovePlayer(
  gameState: GameStateDto,
  userId: number
): boolean {
  return gameState.currentMovePlayerId !== userId;
}

function isCellNotFree(gameState: GameStateDto): boolean {
  const currentPlayerID = gameState.currentMovePlayerId;
  const currentCellId = GameLoopService.getCellIdByPlayerId(
    gameState,
    currentPlayerID
  );
  const cellOwnerId = GameLoopService.getOwnerIdByCellId(
    gameState,
    currentCellId
  );
  return cellOwnerId !== null;
}

function validatePlayer(gameState: GameStateDto, userId: number) {
  if (isUserNotInGame(gameState, userId)) {
    throw new ClientError(YOU_ARE_NOT_GAME_PARTICIPANT);
  }

  if (isUserNotCurrentMovePlayer(gameState, userId)) {
    throw new ClientError(NOT_YOUR_MOVE);
  }
}

function validateCell(gameState: GameStateDto) {
  if (isCellNotFree(gameState)) {
    throw new ClientError(CELL_NOT_FREE);
  }
}

async function getGameStateByPlayerId(playerId: number): Promise<GameStateDto> {
  const lobbyParticipant = await LobbyService.loadLobbyParticipant(playerId);
  const { lobby } = lobbyParticipant;

  if (lobby.game === null) {
    throw new ClientError(NO_ACTIVE_GAME);
  }

  return GameLoopService.getState(lobby.game.id);
}

export default {
  async rollDices(userId: number): Promise<void> {
    const gameState = await getGameStateByPlayerId(userId);
    validatePlayer(gameState, userId);

    const cellId = GameLoopService.getCellIdByPlayerId(
      gameState,
      gameState.currentMovePlayerId
    );

    const move = GameLoopService.rollDices(gameState);
    const nextCellId = GameLoopService.getNextCellId(gameState, cellId, move);
    const isEndOfTurn = GameLoopService.moveToCell(gameState, nextCellId);

    if (isEndOfTurn) {
      GameLoopService.changeCurrentMovePlayer(gameState);
    }
  },

  async acceptPurchase(userId: number): Promise<void> {
    const gameState = await getGameStateByPlayerId(userId);
    validatePlayer(gameState, userId);
    validateCell(gameState);
    GameLoopService.acceptPurchase(gameState);
  },

  async declinePurchase(userId: number): Promise<void> {
    const gameState = await getGameStateByPlayerId(userId);
    validatePlayer(gameState, userId);
    GameLoopService.declinePurchase(gameState);
  },
};
