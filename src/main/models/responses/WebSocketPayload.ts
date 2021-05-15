import GameEventEnum from '../enums/GameEventEnum';

export default interface WebSocketPayloadDto<PayloadType> {
  event: GameEventEnum;
  payload: PayloadType;
}
