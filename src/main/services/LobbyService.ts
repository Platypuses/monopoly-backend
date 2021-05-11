import { getRepository } from 'typeorm';
import Lobby from '../models/entities/Lobby';
import LobbyStatus from '../models/entities/enums/LobbyStatus';
import logger from '../config/logger';
import LobbyCreationResponseDto from '../models/responses/LobbyCreationResponseDto';

// const LOBBY_DOES_NOT_EXIST = 'Лобби не существует';
// const USER_IS_IN_LOBBY = 'Вы уже являетесь участником лобби';
// const NOT_AN_OWNER = 'Пользователь не является владельцем лобби';

export default {
  async createLobby(): Promise<LobbyCreationResponseDto> {
    // TODO валидация
    // await validateLobbyRegistration();
    let lobby: Lobby = new Lobby();
    lobby.status = LobbyStatus.WAITING_FOR_PLAYERS;
    // TODO добавить кретора лобби
    lobby.lobbyParticipants = [];
    lobby.lobbyMessages = [];
    lobby = await getRepository(Lobby).save(lobby);
    logger.info(`Created lobby with id '${lobby.id}'.`);
    return {
      lobbyId: lobby.id,
    };
  },
};
