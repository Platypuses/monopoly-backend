/* eslint-disable node/no-unpublished-import */

import bodyParser from 'body-parser';
import { createConnection } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import swaggerUi from 'swagger-ui-express';
import { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { RegisterRoutes } from '../tsoa/routes';
import {
  POSTGRES_DB_HOST,
  POSTGRES_DB_NAME,
  POSTGRES_DB_PASSWORD,
  POSTGRES_DB_PORT,
  POSTGRES_DB_USERNAME,
  SWAGGER_PATH,
} from './main/config/appConfigProperties';
import User from './main/models/entities/User';
import UserStatistics from './main/models/entities/UserStatistics';
import Avatar from './main/models/entities/Avatar';
import RefreshToken from './main/models/entities/RefreshToken';
import Lobby from './main/models/entities/Lobby';
import LobbyParticipant from './main/models/entities/LobbyParticipant';
import LobbyMessage from './main/models/entities/LobbyMessage';
import ErrorResponseDto from './main/models/responses/ErrorResponseDto';
import ErrorHandler from './main/models/error/ErrorHandler';

async function configureDatabaseConnection() {
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

function configureSwaggerUI(app: Express) {
  app.use(
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

function configureErrorHandler(app: Express) {
  app.use(
    (
      error: unknown,
      req: Request,
      res: Response<ErrorResponseDto>,
      next: NextFunction
    ) => ErrorHandler.handleError(error, req, res, next)
  );
}

export default async function configureServer(app: Express): Promise<void> {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cors());

  await configureDatabaseConnection();
  configureSwaggerUI(app);
  RegisterRoutes(app);
  configureErrorHandler(app);
}
