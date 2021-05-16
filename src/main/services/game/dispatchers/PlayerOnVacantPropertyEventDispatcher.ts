import GameStateDto from '../../../models/responses/game/state/GameStateDto';
import PlayerOnVacantPropertyDto from '../../../models/responses/game/events/PlayerOnVacantPropertyDto';
import WebSocketEventEnum from '../../../models/enums/WebSocketEventEnum';
import WebSocketService from '../../WebSocketService';

export default {
  dispatchEvent(
    gameState: GameStateDto,
    playerId: number,
    cellId: number
  ): void {
    const eventPayload: PlayerOnVacantPropertyDto = {
      playerId,
      cellId,
    };

    const webSocketPayload = {
      event: WebSocketEventEnum.PLAYER_ON_VACANT_PROPERTY,
      payload: eventPayload,
    };

    gameState.players.forEach((player) =>
      WebSocketService.send(player.playerId, webSocketPayload)
    );
  },
};
