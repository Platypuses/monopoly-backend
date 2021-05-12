import { getRepository } from 'typeorm';
import LobbyParticipant from '../models/entities/LobbyParticipant';
import Lobby from '../models/entities/Lobby';
import ClientError from '../models/error/ClientError';

const MAX_PLAYERS_NUMBER = 6;

const USER_IS_A_LOBBY_MEMBER = 'Пользователь уже находится в лобби.';
const USER_IS_NOT_A_LOBBY_MEMBER = 'Пользователь не состоит ни в одном лобби.';
const LOBBY_DOES_NOT_EXIST = 'Лобби не существует.';
const LOBBY_REFUSED_PLAYER = 'Лобби не принимает новых игроков.';

async function isLobbyParticipant(userId: number): Promise<boolean> {
  const lobbyParticipant = await getRepository(LobbyParticipant).find({
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

    if (await isLobbyParticipant(userId)) {
      throw new ClientError(USER_IS_A_LOBBY_MEMBER);
    }

    const lobbyParticipant = new LobbyParticipant();
    lobbyParticipant.user.id = userId;
    lobbyParticipant.lobby.id = lobbyId;
    lobbyParticipant.isCreator = false;
    lobbyParticipant.isReady = false;
    await getRepository(LobbyParticipant).save(lobbyParticipant);
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

    if (!lobbyParticipant) {
      throw new ClientError(USER_IS_NOT_A_LOBBY_MEMBER);
    }

    await getRepository(LobbyParticipant).delete({ user: { id: userId } });
  },
};
