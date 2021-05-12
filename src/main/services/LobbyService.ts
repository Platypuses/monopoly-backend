import { getRepository } from 'typeorm';
import Lobby from '../models/entities/Lobby';
import User from '../models/entities/User';
import LobbyParticipant from '../models/entities/LobbyParticipant';
import LobbyStatus from '../models/entities/enums/LobbyStatus';
import logger from '../config/logger';
import LobbyCreationResponseDto from '../models/responses/LobbyCreationResponseDto';
import ClientError from '../models/error/ClientError';
import LobbyResponseDto from '../models/responses/LobbyResponseDto';

const USER_DOES_NOT_EXIST = 'Пользователь не существует';
const LOBBY_DOES_NOT_EXIST = 'Лобби не существует';
const USER_IS_IN_LOBBY = 'Вы уже являетесь участником лобби';
const NOT_AN_OWNER = 'Вы не являетесь создателем лобби';
const LOBBY_CREATOR_DOES_NOT_EXIST = 'Создать лобби не определён';
const NOT_A_PARTICIPANT = 'Вы не являетесь участником этого лобби';

async function checkThatUserNotLobbyParticipant(user: User) {
  const lobbyParticipant = await getRepository(LobbyParticipant).findOne({
    user,
  });
  if (lobbyParticipant !== undefined) {
    throw new ClientError(USER_IS_IN_LOBBY);
  }
}

async function checkThatUserParticipatesInLobby(user: User, lobby: Lobby) {
  const lobbyParticipant = await getRepository(LobbyParticipant).findOne({
    user,
    lobby,
  });
  if (lobbyParticipant === undefined) {
    throw new ClientError(NOT_A_PARTICIPANT);
  }
}

async function checkThatUserIsLobbyCreator(userId: number, lobbyId: number) {
  const lobbyParticipants = await getRepository(LobbyParticipant).find({
    lobby: { id: lobbyId },
  });
  const lobbyCreator = lobbyParticipants.find((element) => element.isCreator);
  if (lobbyCreator === undefined) {
    throw new ClientError(LOBBY_CREATOR_DOES_NOT_EXIST);
  }
  if (userId !== lobbyCreator.user.id) {
    throw new ClientError(NOT_AN_OWNER);
  }
}

export default {
  async createLobby(userId: number): Promise<LobbyCreationResponseDto> {
    const user = await getRepository(User).findOne(userId);
    if (user === undefined) {
      throw new ClientError(USER_DOES_NOT_EXIST);
    }
    await checkThatUserNotLobbyParticipant(user);

    let lobby: Lobby = new Lobby();
    lobby.status = LobbyStatus.WAITING_FOR_PLAYERS;
    lobby = await getRepository(Lobby).save(lobby);
    logger.info(`Created lobby with id '${lobby.id}'.`);

    let lobbyCreator: LobbyParticipant = new LobbyParticipant();
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
    const user = await getRepository(User).findOne(userId);
    if (user === undefined) {
      throw new ClientError(USER_DOES_NOT_EXIST);
    }

    const lobby = await getRepository(Lobby).findOne(lobbyId);
    if (lobby === undefined) {
      throw new ClientError(LOBBY_DOES_NOT_EXIST);
    }

    await checkThatUserIsLobbyCreator(user.id, lobby.id);

    logger.info(`Delete lobby '${lobby.id}'`);
    await getRepository(Lobby).delete(lobby.id);
  },

  async getLobbyById(
    lobbyId: number,
    userId: number
  ): Promise<LobbyResponseDto> {
    const user = await getRepository(User).findOne(userId);
    if (user === undefined) {
      throw new ClientError(USER_DOES_NOT_EXIST);
    }

    const lobby = await getRepository(Lobby).findOne(lobbyId);
    if (lobby === undefined) {
      throw new ClientError(LOBBY_DOES_NOT_EXIST, 404);
    }

    await checkThatUserParticipatesInLobby(user, lobby);

    return {
      id: lobbyId,
      status: lobby.status,
      lobbyParticipants: lobby.lobbyParticipants.map((participant) => ({
        id: participant.user.id,
        nickname: participant.user.nickname,
        isCreator: participant.isCreator,
        isReady: participant.isReady,
      })),
      lobbyMessages: lobby.lobbyMessages.map((message) => ({
        senderId: message.user.id,
        senderNickname: message.user.nickname,
        messageText: message.messageText,
        messageDate: message.messageDate,
      })),
    };
  },
};
