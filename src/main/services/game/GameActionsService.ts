import GameLoopService from './GameLoopService';
import GameStateDto from '../../models/responses/game/state/GameStateDto';
import ClientError from '../../models/error/ClientError';
import LobbyService from '../LobbyService';

const YOU_ARE_NOT_GAME_PARTICIPANT = 'Вы не участник игры';
const NOT_YOUR_MOVE = 'Не ваш ход';

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

export default {
  async rollDices(userId: number): Promise<void> {
    const lobbyParticipant = await LobbyService.loadLobbyParticipant(userId);
    const { lobby } = lobbyParticipant;

    if (lobby.game === null) {
      return;
    }

    const gameState = GameLoopService.getState(lobby.game.id);

    if (isUserNotInGame(gameState, userId)) {
      throw new ClientError(YOU_ARE_NOT_GAME_PARTICIPANT);
    }

    if (isUserNotCurrentMovePlayer(gameState, userId)) {
      throw new ClientError(NOT_YOUR_MOVE);
    }

    GameLoopService.rollDices(gameState);
  },
};
