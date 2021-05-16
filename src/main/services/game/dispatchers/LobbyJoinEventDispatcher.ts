import WebSocketEventEnum from '../../../models/enums/WebSocketEventEnum';
import WebSocketService from '../../WebSocketService';
import LobbyParticipant from '../../../models/entities/LobbyParticipant';
import LobbyJoinLeaveEventPayload from '../../../models/responses/game/events/LobbyJoinLeaveEventPayload';

export default {
  dispatchEvent(
    userId: number,
    username: string,
    lobbyParticipants: LobbyParticipant[]
  ): void {
    const eventPayload: LobbyJoinLeaveEventPayload = {
      userId,
      username,
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
