import 'reflect-metadata';
import express, { Express, NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import { createConnection } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { RegisterRoutes } from '../tsoa/routes';
import {
  PORT,
  POSTGRES_DB_HOST,
  POSTGRES_DB_NAME,
  POSTGRES_DB_PASSWORD,
  POSTGRES_DB_PORT,
  POSTGRES_DB_USERNAME,
  SWAGGER_PATH,
} from './main/config/appConfigProperties';
import logger from './main/config/logger';
import ErrorResponseDto from './main/models/responses/ErrorResponseDto';
import ErrorHandler from './main/models/error/ErrorHandler';
import User from './main/models/entities/User';
import UserStatistics from './main/models/entities/UserStatistics';
import Avatar from './main/models/entities/Avatar';
import RefreshToken from './main/models/entities/RefreshToken';
import Lobby from './main/models/entities/Lobby';
import LobbyParticipant from './main/models/entities/LobbyParticipant';
import LobbyMessage from './main/models/entities/LobbyMessage';

export default class Server {
  private readonly app: Express;

  constructor() {
    this.app = express();
  }

  public async configure(): Promise<void> {
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());

    await Server.configureDatabaseConnection();
    this.configureSwaggerUI();
    RegisterRoutes(this.app);
    this.configureErrorHandler();
  }

  private static async configureDatabaseConnection() {
    const connection = await createConnection({
      type: 'postgres',
      host: POSTGRES_DB_HOST,
      port: POSTGRES_DB_PORT,
      username: POSTGRES_DB_USERNAME,
      password: POSTGRES_DB_PASSWORD,
      database: POSTGRES_DB_NAME,
      entities: [
        User,
        UserStatistics,
        Avatar,
        RefreshToken,
        Lobby,
        LobbyParticipant,
        LobbyMessage,
      ],
      migrations: ['**/migrations/*.js'],
      logging: ['schema', 'info', 'error'],
      synchronize: false,
      namingStrategy: new SnakeNamingStrategy(),
    });

    await connection.runMigrations({ transaction: 'all' });
  }

  private configureSwaggerUI() {
    this.app.use(
      SWAGGER_PATH,
      swaggerUi.serve,
      async (_req: Request, res: Response) => {
        const swaggerUiHtml = swaggerUi.generateHTML(
          await import('../tsoa/swagger.json')
        );

        res.send(swaggerUiHtml);
      }
    );
  }

  private configureErrorHandler() {
    this.app.use(
      (
        error: unknown,
        req: Request,
        res: Response<ErrorResponseDto>,
        next: NextFunction
      ) => ErrorHandler.handleError(error, req, res, next)
    );
  }

  public start(): void {
    this.app.listen(PORT, () =>
      logger.info(
        `App started. Swagger UI: http://localhost:${PORT}${SWAGGER_PATH}`
      )
    );
  }
}
