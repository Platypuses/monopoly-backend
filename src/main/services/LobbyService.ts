import { getRepository } from 'typeorm';
import Lobby from '../models/entities/Lobby';
import User from '../models/entities/User';
import LobbyParticipant from '../models/entities/LobbyParticipant';
import LobbyStatus from '../models/enums/LobbyStatus';
import logger from '../config/logger';
import LobbyCreationResponseDto from '../models/responses/LobbyCreationResponseDto';
import ClientError from '../models/error/ClientError';
import LobbyResponseDto from '../models/responses/LobbyResponseDto';
import UserService from '../services/UserService';
import LobbyJoinEventDispatcher from './game/dispatchers/LobbyJoinEventDispatcher';
import LobbyLeaveEventDispatcher from './game/dispatchers/LobbyLeaveEventDispatcher';
import LobbyDissolveEventDispatch from './game/dispatchers/LobbyDissolveEventDispatcher';

const MAX_PLAYERS_NUMBER = 6;

const LOBBY_DOES_NOT_EXIST = 'Лобби не существует';
const LOBBY_REFUSED_PLAYER = 'Лобби отклонило соединение';
const USER_IS_A_LOBBY_MEMBER = 'Пользователь является участником лобби';
const USER_IS_NOT_A_LOBBY_MEMBER = 'Пользователь не является участником лобби';

async function checkThatUserParticipatesInLobby(user: User, lobby: Lobby) {
  const lobbyParticipant = await getRepository(LobbyParticipant).findOne({
    user,
    lobby,
  });
  if (lobbyParticipant === undefined) {
    throw new ClientError(USER_IS_NOT_A_LOBBY_MEMBER);
  }
}

async function isLobbyParticipant(userId: number): Promise<boolean> {
  const lobbyParticipant = await getRepository(LobbyParticipant).findOne({
    user: { id: userId },
  });

  return lobbyParticipant !== undefined;
}

async function getLobbyByIdIfExists(lobbyId: number): Promise<Lobby> {
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

export default {
  async createLobby(userId: number): Promise<LobbyCreationResponseDto> {
    const user = await UserService.getUserByIdIfExists(userId);
    await checkThatUserIsNotLobbyParticipant(userId);

    let lobby = new Lobby();
    lobby.status = LobbyStatus.WAITING_FOR_PLAYERS;
    lobby = await getRepository(Lobby).save(lobby);
    logger.info(`Created lobby with id '${lobby.id}'.`);

    const lobbyCreator = new LobbyParticipant();
    lobbyCreator.user = user;
    lobbyCreator.isCreator = true;
    lobbyCreator.isReady = true;
    lobbyCreator.lobby = lobby;
    await getRepository(LobbyParticipant).save(lobbyCreator);

    logger.info(
      `Created lobby participant '${user.nickname}' with id '${user.id}', role - creator.`
    );

    return {
      lobbyId: lobby.id,
    };
  },

  async deleteLobby(lobbyId: number): Promise<void> {
    const lobby = await getLobbyByIdIfExists(lobbyId);

    logger.info(`Lobby [LOBBY_ID:'${lobby.id}'] has been deleted`);

    LobbyDissolveEventDispatch.dispatchEvent(lobby.lobbyParticipants, lobbyId);

    await getRepository(Lobby).delete(lobby.id);
  },

  async createLobbyParticipant(lobbyId: number, userId: number): Promise<void> {
    const lobby = await getLobbyByIdIfExists(lobbyId);

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

    const user = await UserService.getUserByIdIfExists(userId);
    LobbyJoinEventDispatcher.dispatchEvent(
      user.id,
      user.nickname,
      lobby.lobbyParticipants
    );

    logger.info(
      `User [USER_ID: ${userId}] joined lobby [LOBBY_ID: ${lobbyId}]`
    );
  },

  async deleteLobbyParticipant(userId: number): Promise<void> {
    const lobbyParticipant = await this.loadLobbyParticipant(userId);

    if (lobbyParticipant.isCreator) {
      await this.deleteLobby(lobbyParticipant.lobby.id);
      return;
    }

    await getRepository(LobbyParticipant).delete(lobbyParticipant);

    const user = await UserService.getUserByIdIfExists(userId);
    LobbyLeaveEventDispatcher.dispatchEvent(
      user.id,
      user.nickname,
      lobbyParticipant.lobby.lobbyParticipants
    );

    logger.info(`User [USER_ID: ${userId}] left lobby`);
  },

  async loadLobbyParticipant(userId: number): Promise<LobbyParticipant> {
    const lobbyParticipant = await getRepository(LobbyParticipant).findOne(
      {
        user: { id: userId },
      },
      {
        relations: ['lobby'],
        loadEagerRelations: false,
      }
    );

    if (lobbyParticipant === undefined) {
      throw new ClientError(USER_IS_NOT_A_LOBBY_MEMBER);
    }

    return lobbyParticipant;
  },

  async getLobbyById(
    lobbyId: number,
    userId: number
  ): Promise<LobbyResponseDto> {
    const user = await UserService.getUserByIdIfExists(userId);
    const lobby = await getLobbyByIdIfExists(lobbyId);

    await checkThatUserParticipatesInLobby(user, lobby);

    const lobbyParticipants = lobby.lobbyParticipants.map((participant) => ({
      id: participant.user.id,
      nickname: participant.user.nickname,
      isCreator: participant.isCreator,
      isReady: participant.isReady,
    }));

    const lobbyMessages = lobby.lobbyMessages.map((message) => ({
      senderId: message.user.id,
      senderNickname: message.user.nickname,
      messageText: message.messageText,
      messageDate: message.messageDate,
    }));

    return {
      id: lobbyId,
      status: lobby.status,
      lobbyParticipants,
      lobbyMessages,
    };
  },
};
