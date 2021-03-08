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
import User from './main/models/entities/User';
import ErrorResponseDto from './main/models/responses/ErrorResponseDto';
import ErrorHandler from './main/models/error/ErrorHandler';
import UserStatistics from './main/models/entities/UserStatistics';
import Avatar from './main/models/entities/Avatar';
import RefreshToken from './main/models/entities/RefreshToken';
import Lobby from './main/models/entities/Lobby';
import LobbyParticipant from './main/models/entities/LobbyParticipant';
import LobbyMessage from './main/models/entities/LobbyMessage';
import V1UsersTable1615214597840 from './resources/migrations/V1UsersTable1615214597840';
import V2UserStatisticsTable1615214803032 from './resources/migrations/V2UserStatisticsTable1615214803032';
import V3AvatarsTable1615214875576 from './resources/migrations/V3AvatarsTable1615214875576';
import V4RefreshTokensTable1615214946258 from './resources/migrations/V4RefreshTokensTable1615214946258';
import V5LobbiesTable1615215024008 from './resources/migrations/V5LobbiesTable1615215024008';
import V6LobbyParticipantsTable1615215080790 from './resources/migrations/V6LobbyParticipantsTable1615215080790';
import V7LobbyMessagesTable1615215122198 from './resources/migrations/V7LobbyMessagesTable1615215122198';

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
        Avatar,
        UserStatistics,
        RefreshToken,
        Lobby,
        LobbyParticipant,
        LobbyMessage,
      ],
      migrations: [
        V1UsersTable1615214597840,
        V2UserStatisticsTable1615214803032,
        V3AvatarsTable1615214875576,
        V4RefreshTokensTable1615214946258,
        V5LobbiesTable1615215024008,
        V6LobbyParticipantsTable1615215080790,
        V7LobbyMessagesTable1615215122198,
      ],
      logging: true,
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
