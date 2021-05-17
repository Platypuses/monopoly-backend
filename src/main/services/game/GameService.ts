import { getRepository } from 'typeorm';
import GameStateDto from '../../models/responses/game/state/GameStateDto';
import Lobby from '../../models/entities/Lobby';
import LobbyParticipant from '../../models/entities/LobbyParticipant';
import Game from '../../models/entities/Game';
import PlayerDto from '../../models/responses/game/state/PlayerDto';
import logger from '../../config/logger';
import LobbyService from '../LobbyService';
import LobbyStatus from '../../models/enums/LobbyStatus';
import GameCellDto from '../../models/responses/game/state/GameCellDto';
import GameLoopService from './GameLoopService';
import CellsUtils from './utils/CellsUtils';

const DEFAULT_BALANCE = 1500;
const DEFAULT_CELL_ID = 1;
// const CELLS_COUNT = 40;

/* eslint-disable no-param-reassign */

function shufflePlayers(players: PlayerDto[]) {
  for (let i = players.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [players[i], players[j]] = [players[j], players[i]];
    players[i].moveOrder = i + 1;
  }

  players[0].moveOrder = 1;

  return players;
}

function initPlayersList(lobbyParticipants: LobbyParticipant[]): PlayerDto[] {
  return lobbyParticipants.map((participant) => ({
    playerId: participant.user.id,
    nickname: participant.user.nickname,
    balance: DEFAULT_BALANCE,
    cellId: DEFAULT_CELL_ID,
    moveOrder: 0,
  }));
}

function initCellsList(): GameCellDto[] {
  return CellsUtils.initCellsList();
}

function initGameState(gameId: number, lobby: Lobby): GameStateDto {
  const players = shufflePlayers(initPlayersList(lobby.lobbyParticipants));

  return {
    gameId,
    players,
    cells: initCellsList(),
    currentMovePlayerId: players[0].playerId,
  };
}

export default {
  async startGame(userId: number): Promise<GameStateDto> {
    const lobbyParticipant = await LobbyService.loadLobbyParticipant(userId);
    const { lobby } = lobbyParticipant;

    const gameRepository = getRepository(Game);

    if (lobby.game !== null) {
      await gameRepository.remove(lobby.game);
    }

    const savedGame: Game = await gameRepository.save({
      lobby,
      stateJson: null,
    });

    const gameState = initGameState(savedGame.id, lobby);
    savedGame.stateJson = JSON.stringify(gameState);
    await gameRepository.save(savedGame);

    await getRepository(Lobby).save({
      id: lobby.id,
      status: LobbyStatus.IN_GAME,
    });

    GameLoopService.start(gameState);

    logger.info(`Saved game with id ${savedGame.id}`);

    return gameState;
  },

  async stopGame(userId: number): Promise<void> {
    const lobbyParticipant = await LobbyService.loadLobbyParticipant(userId);
    const { lobby } = lobbyParticipant;

    if (lobby.game === null) {
      return;
    }

    GameLoopService.stop(lobby.game.id);
    await LobbyService.deleteLobby(lobby.id);
    logger.info(`Stopped game with id ${lobby.game.id}`);
  },

  getGameState(gameId: number): GameStateDto {
    return GameLoopService.getState(gameId);
  },

  async saveGameState(gameState: GameStateDto): Promise<void> {
    const gameRepository = getRepository(Game);
    const game = await gameRepository.findOne(gameState.gameId);

    if (game === undefined) {
      return;
    }

    game.stateJson = JSON.stringify(gameState);
    await gameRepository.save(game);
    logger.info(`Saved game state of game with id ${gameState.gameId}`);
  },
};
