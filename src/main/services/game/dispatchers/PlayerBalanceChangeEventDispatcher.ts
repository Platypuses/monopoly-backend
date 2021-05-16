import GameStateDto from '../../../models/responses/game/state/GameStateDto';
import WebSocketEventEnum from '../../../models/enums/WebSocketEventEnum';
import WebSocketService from '../../WebSocketService';
import PlayerBalanceChangeEventPayload from '../../../models/responses/game/events/PlayerBalanceChangeEventPayload';

export default {
  dispatchEvent(
    gameState: GameStateDto,
    playerId: number,
    balanceDelta: number
  ): void {
    const eventPayload: PlayerBalanceChangeEventPayload = {
      playerId,
      balanceDelta,
    };

    const webSocketPayload = {
      event: WebSocketEventEnum.PLAYER_BALANCE_CHANGE,
      payload: eventPayload,
    };

    gameState.players.forEach((player) =>
      WebSocketService.send(player.playerId, webSocketPayload)
    );
  },
};
