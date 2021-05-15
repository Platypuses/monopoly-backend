import { getRepository } from 'typeorm';
import Lobby from '../models/entities/Lobby';
import LobbyParticipant from '../models/entities/LobbyParticipant';
import LobbyStatus from '../models/entities/enums/LobbyStatus';
import logger from '../config/logger';
import LobbyCreationResponseDto from '../models/responses/LobbyCreationResponseDto';
import ClientError from '../models/error/ClientError';
import UserService from '../services/UserService';

const MAX_PLAYERS_NUMBER = 6;

const LOBBY_DOES_NOT_EXIST = 'Lobby does not exist';
const LOBBY_REFUSED_PLAYER = 'Lobby refused connection';
const LOBBY_CREATOR_DOES_NOT_EXIST = 'Создать лобби не определён';

const USER_IS_A_LOBBY_MEMBER = 'User is a lobby member';
const USER_IS_NOT_A_LOBBY_MEMBER = 'User is not a lobby member';
const NOT_AN_OWNER = 'Вы не являетесь создателем лобби';

async function isLobbyParticipant(userId: number): Promise<boolean> {
  const lobbyParticipant = await getRepository(LobbyParticipant).findOne({
    user: { id: userId },
  });

  return lobbyParticipant !== undefined;
}

async function getLobby(lobbyId: number): Promise<Lobby> {
  const lobby = await getRepository(Lobby).findOne(lobbyId);

  if (!lobby) {
    throw new ClientError(LOBBY_DOES_NOT_EXIST);
  }

  return lobby;
}

async function checkThatUserIsNotLobbyParticipant(userId: number) {
  if (await isLobbyParticipant(userId)) {
    throw new ClientError(USER_IS_A_LOBBY_MEMBER);
  }
}

async function isLobbyCreator(
  userId: number,
  lobbyId: number
): Promise<boolean> {
  const lobbyCreator = await getRepository(LobbyParticipant).findOne({
    lobby: { id: lobbyId },
    isCreator: true,
  });

  if (lobbyCreator === undefined) {
    throw new ClientError(LOBBY_CREATOR_DOES_NOT_EXIST);
  }
  return userId === lobbyCreator.user.id;
}

async function checkThatUserIsLobbyCreator(userId: number, lobbyId: number) {
  if (!(await isLobbyCreator(userId, lobbyId))) {
    throw new ClientError(NOT_AN_OWNER);
  }
}

export default {
  async createLobby(userId: number): Promise<LobbyCreationResponseDto> {
    const user = await UserService.getUserByIdIfExists(userId);
    await checkThatUserIsNotLobbyParticipant(userId);

    let lobby = new Lobby();
    lobby.status = LobbyStatus.WAITING_FOR_PLAYERS;
    lobby = await getRepository(Lobby).save(lobby);
    logger.info(`Created lobby with id '${lobby.id}'.`);

    let lobbyCreator = new LobbyParticipant();
    lobbyCreator.user = user;
    lobbyCreator.isCreator = true;
    lobbyCreator.isReady = true;
    lobbyCreator.lobby = lobby;
    lobbyCreator = await getRepository(LobbyParticipant).save(lobbyCreator);
    logger.info(
      `Created lobby participant '${user.nickname}' with id '${user.id}', role - creator.`
    );

    return {
      lobbyId: lobby.id,
    };
  },

  async deleteLobby(lobbyId: number, userId: number): Promise<void> {
    const user = await UserService.getUserByIdIfExists(userId);
    const lobby = await getLobby(lobbyId);
    await checkThatUserIsLobbyCreator(user.id, lobby.id);

    logger.info(`Delete lobby '${lobby.id}'`);
    await getRepository(Lobby).delete(lobby.id);
  },

  async createLobbyParticipant(lobbyId: number, userId: number): Promise<void> {
    const lobby = await getLobby(lobbyId);

    if (await isLobbyParticipant(userId)) {
      throw new ClientError(USER_IS_A_LOBBY_MEMBER);
    }

    if (lobby.lobbyParticipants.length >= MAX_PLAYERS_NUMBER) {
      throw new ClientError(LOBBY_REFUSED_PLAYER);
    }

    if (lobby.status !== LobbyStatus.WAITING_FOR_PLAYERS) {
      throw new ClientError(LOBBY_REFUSED_PLAYER);
    }

    await getRepository(LobbyParticipant).save({
      user: { id: userId },
      lobby: { id: lobbyId },
      isCreator: false,
      isReady: false,
    });

    logger.info(
      `User [USER_ID: ${userId}] joined lobby [LOBBY_ID: ${lobbyId}]`
    );
  },

  async deleteLobbyParticipant(userId: number): Promise<void> {
    const lobbyParticipant = await getRepository(LobbyParticipant).findOne({
      user: { id: userId },
    });

    if (lobbyParticipant === undefined) {
      throw new ClientError(USER_IS_NOT_A_LOBBY_MEMBER);
    }

    await getRepository(LobbyParticipant).delete(lobbyParticipant);
    await logger.info(`User [USER_ID: ${userId}] left lobby`);
  },
};
