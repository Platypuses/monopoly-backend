import WebSocketEventEnum from '../../../models/enums/WebSocketEventEnum';
import WebSocketService from '../../WebSocketService';
import GameStateDto from '../../../models/responses/game/state/GameStateDto';
import PlayerOnChanceCellEventPayload from '../../../models/responses/game/events/PlayerOnChanceCellEventPayload';

export default {
  dispatchEvent(
    gameState: GameStateDto,
    userId: number,
    cellId: number,
    description: string
  ): void {
    const eventPayload: PlayerOnChanceCellEventPayload = {
      userId,
      cellId,
      description,
    };

    const webSocketPayload = {
      event: WebSocketEventEnum.PLAYER_ON_CHANCE_CELL,
      payload: eventPayload,
    };

    gameState.players.forEach((player) =>
      WebSocketService.send(player.playerId, webSocketPayload)
    );
  },
};
