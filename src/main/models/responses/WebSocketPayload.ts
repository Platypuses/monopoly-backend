import WebSocketEventEnum from '../enums/WebSocketEventEnum';

export default interface WebSocketPayloadDto<PayloadType> {
  event: WebSocketEventEnum;
  payload: PayloadType;
}
