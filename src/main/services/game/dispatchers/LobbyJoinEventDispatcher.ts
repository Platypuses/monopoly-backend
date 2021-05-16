import WebSocketEventEnum from '../../../models/enums/WebSocketEventEnum';
import WebSocketService from '../../WebSocketService';
import LobbyParticipant from '../../../models/entities/LobbyParticipant';

export default {
  dispatchEvent(lobbyParticipants: LobbyParticipant[], userId: number): void {
    const eventPayload = {
      userId,
    };

    const websocketPayload = {
      event: WebSocketEventEnum.LOBBY_JOIN,
      payload: eventPayload,
    };

    lobbyParticipants.forEach((participant) => {
      WebSocketService.send(participant.user.id, websocketPayload);
    });
  },
};
