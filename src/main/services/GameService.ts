import { getRepository } from 'typeorm';
import GameStateDto from '../models/responses/game/state/GameStateDto';
import Lobby from '../models/entities/Lobby';
import LobbyParticipant from '../models/entities/LobbyParticipant';
import ClientError from '../models/error/ClientError';
import Game from '../models/entities/Game';
import PlayerDto from '../models/responses/game/state/PlayerDto';
import logger from '../config/logger';
import LobbyService from './LobbyService';
import LobbyStatus from '../models/enums/LobbyStatus';
import GameCellDto from '../models/responses/game/state/GameCellDto';
import GameLoopService from './game/GameLoopService';

const GAME_DOES_NOT_EXIST = 'Игра не существует';

const DEFAULT_BALANCE = 1500;
const DEFAULT_CELL_ID = 1;
const CELLS_COUNT = 40;

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
  const cellsList: GameCellDto[] = [];

  for (let i = 1; i <= CELLS_COUNT; i++) {
    cellsList.push({ cellId: i, ownerId: null });
  }

  return cellsList;
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

    if (lobby.game !== undefined) {
      await gameRepository.remove(lobby.game);
    }

    const savedGame: Game = await gameRepository.save({
      lobby,
      stateJson: undefined,
    });

    const gameState = initGameState(savedGame.id, lobby);
    savedGame.stateJson = JSON.stringify(gameState);
    await gameRepository.save(savedGame);

    await getRepository(Lobby).save({
      id: lobby.id,
      status: LobbyStatus.IN_GAME,
    });

    GameLoopService.run(gameState);

    logger.info(`Saved game with id ${savedGame.id}`);

    return gameState;
  },

  async getGameState(userId: number): Promise<GameStateDto> {
    const lobbyParticipant = await LobbyService.loadLobbyParticipant(userId);
    const { game } = lobbyParticipant.lobby;

    if (game === undefined || game.stateJson === undefined) {
      throw new ClientError(GAME_DOES_NOT_EXIST);
    }

    return JSON.parse(game.stateJson);
  },
};
