import WebSocketEventEnum from '../../../models/enums/WebSocketEventEnum';
import WebSocketService from '../../WebSocketService';
import LobbyParticipant from '../../../models/entities/LobbyParticipant';
import LobbyDissolveEventPayload from '../../../models/responses/game/events/LobbyDissolveEventPayload';

export default {
  dispatchEvent(lobbyParticipants: LobbyParticipant[], lobbyId: number): void {
    const eventPayload: LobbyDissolveEventPayload = {
      lobbyId,
    };

    const websocketPayload = {
      event: WebSocketEventEnum.LOBBY_DISSOLVE,
      payload: eventPayload,
    };

    lobbyParticipants.forEach((participant) => {
      WebSocketService.send(participant.user.id, websocketPayload);
    });
  },
};
