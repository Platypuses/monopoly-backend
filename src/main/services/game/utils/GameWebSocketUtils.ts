import GameStateDto from '../../../models/responses/game/state/GameStateDto';
import WebSocketService from '../../WebSocketService';
import WebSocketEventEnum from '../../../models/enums/WebSocketEventEnum';

export default {
  sendGameEvent(
    playerId: number,
    event: WebSocketEventEnum,
    payload: unknown
  ): void {
    const websocketPayloadDto = {
      event,
      payload,
    };

    WebSocketService.send(playerId, websocketPayloadDto);
  },

  sendGameEventToAll(
    gameState: GameStateDto,
    event: WebSocketEventEnum,
    payload: unknown
  ): void {
    const websocketPayloadDto = {
      event,
      payload,
    };

    gameState.players.forEach((player) =>
      WebSocketService.send(player.playerId, websocketPayloadDto)
    );
  },
};
