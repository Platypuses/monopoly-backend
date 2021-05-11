import WebSocket, { CloseEvent, MessageEvent } from 'ws';
import TokenService from './TokenService';
import logger from '../config/logger';
import WSMessageType from '../models/entities/enums/WSMessageType';
import ClientError from '../models/error/ClientError';
import { WEBSOCKET_PORT } from '../config/appConfigProperties';

const WS_CONNECTION = 'connection';
const WS_MESSAGE = 'message';
const WS_CLOSE = 'close';

const BASE_URL = 'ws://base.url';
const INVALID_FRAME_STATUS_CODE = 1007;

const ACCESS_TOKEN_QUERY_NAME = 'accessToken';
const MISS_QUERY_PARAM = `Отсутствует параметр запроса ${ACCESS_TOKEN_QUERY_NAME}`;

const wsClients = new Map<number, WebSocket>();
const wsServer = new WebSocket.Server({ port: WEBSOCKET_PORT });

async function verifyClient(ws: WebSocket, wsUrl: string) {
  const url = new URL(wsUrl, BASE_URL);

  if (!url.searchParams.has(ACCESS_TOKEN_QUERY_NAME)) {
    ws.close(INVALID_FRAME_STATUS_CODE, MISS_QUERY_PARAM);
  }

  const accessToken = url.searchParams.get(ACCESS_TOKEN_QUERY_NAME);
  if (accessToken == null) {
    return;
  }

  try {
    const tokenPayload = await TokenService.parseAccessToken(accessToken);
    wsClients.set(tokenPayload.userId as number, ws);
    logger.info(`Websocket client connected with id ${tokenPayload.userId}.`);
  } catch (err) {
    ws.close(INVALID_FRAME_STATUS_CODE, err.message);
  }
}

function onMessage(messageEvent: MessageEvent): void {
  logger.info(`Received data is ${JSON.stringify(messageEvent)}`);
}

function onClose(code: CloseEvent): void {
  logger.info(`Connection closed cleanly, code ${code}.`);
}

export default {
  configureWebsocketServer(): void {
    wsServer.on(WS_CONNECTION, async (ws: WebSocket, request: Request) => {
      await verifyClient(ws, request.url);
      ws.on(WS_MESSAGE, onMessage);
      ws.on(WS_CLOSE, onClose);
    });
  },

  send(userId: number, type: WSMessageType, payload: unknown): void {
    const wsClient = wsClients.get(userId);
    if (wsClient === undefined) {
      throw new ClientError(`Client with such id ${userId} does not exist`);
    }

    wsClient.send(JSON.stringify({ type, payload }));
  },
};
