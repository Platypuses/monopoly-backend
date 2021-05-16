import WebSocketEventEnum from '../../../models/enums/WebSocketEventEnum';
import WebSocketService from '../../WebSocketService';
import CurrentMovePlayerChangeEventPayload from '../../../models/responses/game/events/CurrentMovePlayerChangeEventPayload';
import GameStateDto from '../../../models/responses/game/state/GameStateDto';

export default {
  dispatchEvent(gameState: GameStateDto, userId: number): void {
    const eventPayload: CurrentMovePlayerChangeEventPayload = {
      userId,
    };

    const webSocketPayload = {
      event: WebSocketEventEnum.CURRENT_MOVE_PLAYER_CHANGE,
      payload: eventPayload,
    };

    gameState.players.forEach((player) =>
      WebSocketService.send(player.playerId, webSocketPayload)
    );
  },
};
