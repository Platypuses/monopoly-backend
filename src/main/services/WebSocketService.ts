import WebSocket, { CloseEvent, MessageEvent } from 'ws';
import { StatusCodes } from 'http-status-codes';
import { JWTPayload } from 'jose/jwt/sign';
import TokenService from './TokenService';
import ClientError from '../models/error/ClientError';
import WSMessageType from '../models/entities/enums/WSMessageType';
import logger from '../config/logger';

const WS_CONNECTION = 'connection';
const ACCESS_TOKEN_QUERY_NAME = 'accessToken';
const BASE_URL = 'ws://localhost:8000';

const MISS_QUERY_PARAM = `Отсутствует параметр запроса ${ACCESS_TOKEN_QUERY_NAME}`;

export default class WebSocketService {
  private wss: WebSocket.Server;

  private clients: Map<number, WebSocket>;

  constructor() {
    this.wss = new WebSocket.Server({ port: 8000 });
    this.clients = new Map<number, WebSocket>();
    this.configureWebSocket();
  }

  private configureWebSocket() {
    this.wss.on(WS_CONNECTION, (ws: WebSocket, request: Request) => {
      this.verifyClient(ws, request.url);

      // eslint-disable-next-line no-param-reassign
      ws.onmessage = WebSocketService.onmessage;

      // eslint-disable-next-line no-param-reassign
      ws.onclose = WebSocketService.onclose;
    });
  }

  private verifyClient(ws: WebSocket, wsUrl: string) {
    const url: URL = new URL(wsUrl, BASE_URL);

    if (!url.searchParams.has(ACCESS_TOKEN_QUERY_NAME)) {
      ws.close();
      throw new ClientError(MISS_QUERY_PARAM, StatusCodes.BAD_REQUEST);
    }

    const accessToken = url.searchParams.get(ACCESS_TOKEN_QUERY_NAME);
    if (typeof accessToken === 'string') {
      TokenService.parseAccessToken(accessToken)
        .then((tokenPayload: JWTPayload) => {
          this.clients.set(tokenPayload.userId, ws);
          logger.info(
            `Websocket client connected with id ${tokenPayload.userId}.`
          );
          this.send(tokenPayload.userId, WSMessageType.TEST, new Date());
        })
        .catch((err: ClientError) => {
          ws.close();
          throw new ClientError(err.message, err.status);
        });
    }
  }

  public send(userId: number, type: WSMessageType, payload: unknown): void {
    const ws = this.clients.get(userId);
    if (ws === undefined) {
      throw new ClientError(`Client with such id ${userId} does not exist`);
    }

    ws.send(JSON.stringify({ type, payload }));
  }

  private static onmessage(event: MessageEvent): void {
    logger.info(`Received data is ${event.data}`);
  }

  private static onclose(event: CloseEvent): void {
    if (event.wasClean) {
      logger.info(
        `Connection closed cleanly, code ${event.code}, reason ${event.reason}.`
      );
    } else {
      logger.warn('Connection died');
    }
  }
}
