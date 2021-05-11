import WebSocket, { CloseEvent, MessageEvent } from 'ws';
import TokenService from './TokenService';
import logger from '../config/logger';
import WSMessageType from '../models/entities/enums/WSMessageType';
import ClientError from '../models/error/ClientError';

const WS_CONNECTION = 'connection';
const WS_MESSAGE = 'message';
const WS_CLOSE = 'close';

const BASE_URL = 'ws://base.url';
const INVALID_FRAME_STATUS_CODE = 1007;

const ACCESS_TOKEN_QUERY_NAME = 'accessToken';
const MISS_QUERY_PARAM = `Отсутствует параметр запроса ${ACCESS_TOKEN_QUERY_NAME}`;

let wsClients: Map<number, WebSocket>;
let wsServer: WebSocket.Server;

async function verifyClient(ws: WebSocket, wsUrl: string) {
  const url: URL = new URL(wsUrl, BASE_URL);

  if (!url.searchParams.has(ACCESS_TOKEN_QUERY_NAME)) {
    ws.close(INVALID_FRAME_STATUS_CODE, MISS_QUERY_PARAM);
  }

  const accessToken = url.searchParams.get(ACCESS_TOKEN_QUERY_NAME);
  if (accessToken == null) {
    return;
  }

  try {
    const tokenPayload = await TokenService.parseAccessToken(accessToken);
    wsClients.set(tokenPayload.userId, ws);
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
  configureWebsocketServer(port: number): void {
    wsClients = new Map<number, WebSocket>();
    wsServer = new WebSocket.Server({ port });

    wsServer.on(WS_CONNECTION, async (ws: WebSocket, request: Request) => {
      await verifyClient(ws, request.url);
      ws.on(WS_MESSAGE, onMessage);
      ws.on(WS_CLOSE, onClose);
    });
  },

  send(userId: number, type: WSMessageType, payload: unknown): void {
    const ws = wsClients.get(userId);
    if (ws === undefined) {
      throw new ClientError(`Client with such id ${userId} does not exist`);
    }

    ws.send(JSON.stringify({ type, payload }));
  },
};
