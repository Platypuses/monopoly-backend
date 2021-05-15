import { getRepository } from 'typeorm';
import LobbyParticipant from '../models/entities/LobbyParticipant';
import Lobby from '../models/entities/Lobby';
import ClientError from '../models/error/ClientError';
import logger from '../config/logger';
import LobbyStatus from '../models/entities/enums/LobbyStatus';

const MAX_PLAYERS_NUMBER = 6;

const USER_IS_A_LOBBY_MEMBER = 'User is a lobby member';
const USER_IS_NOT_A_LOBBY_MEMBER = 'User is not a lobby member';
const LOBBY_DOES_NOT_EXIST = 'Lobby does not exist';
const LOBBY_REFUSED_PLAYER = 'Lobby refused connection';

async function isLobbyParticipant(userId: number): Promise<boolean> {
  const lobbyParticipant = await getRepository(LobbyParticipant).findOne({
    user: { id: userId },
  });
  return lobbyParticipant !== undefined;
}

export default {
  async createLobbyParticipant(lobbyId: number, userId: number): Promise<void> {
    const lobby = await this.getLobby(lobbyId);

    if (lobby.lobbyParticipants.length >= MAX_PLAYERS_NUMBER) {
      throw new ClientError(LOBBY_REFUSED_PLAYER);
    }

    if (lobby.status !== LobbyStatus.WAITING_FOR_PLAYERS) {
      throw new ClientError(LOBBY_REFUSED_PLAYER);
    }

    const lobbyMember = await isLobbyParticipant(userId);
    if (lobbyMember) {
      throw new ClientError(USER_IS_A_LOBBY_MEMBER);
    }

    await getRepository(LobbyParticipant).save({
      user: { id: userId },
      lobby: { id: lobbyId },
      isCreator: false,
      isReady: false,
    });

    logger.info(`User '${userId}' joined lobby '${lobbyId}'`);
  },

  async getLobby(lobbyId: number): Promise<Lobby> {
    const lobby = await getRepository(Lobby).findOne(lobbyId);

    if (!lobby) {
      throw new ClientError(LOBBY_DOES_NOT_EXIST);
    }

    return lobby;
  },

  async deleteLobbyParticipant(userId: number): Promise<void> {
    const lobbyParticipant = await getRepository(LobbyParticipant).findOne({
      user: { id: userId },
    });
    if (lobbyParticipant === undefined) {
      throw new ClientError(USER_IS_NOT_A_LOBBY_MEMBER);
    }

    await getRepository(LobbyParticipant).delete(lobbyParticipant);

    await logger.info(`User '${userId}' left lobby`);
  },
};
