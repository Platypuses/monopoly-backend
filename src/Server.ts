import 'reflect-metadata';
import express, {
  Express, NextFunction, Request, Response,
} from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import { createConnection } from 'typeorm';
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
import CreateUsersTable1615108604961 from './resources/migrations/CreateUsersTable1615108604961';
import ErrorResponseDto from './main/models/responses/ErrorResponseDto';
import ErrorHandler from './main/models/error/ErrorHandler';

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
      ],
      migrations: [
        CreateUsersTable1615108604961,
      ],
      synchronize: false,
    });

    await connection.runMigrations({ transaction: 'all' });
  }

  private configureSwaggerUI() {
    this.app.use(SWAGGER_PATH, swaggerUi.serve, async (_req: Request, res: Response) => {
      const swaggerUiHtml = swaggerUi.generateHTML(await import('../tsoa/swagger.json'));
      res.send(swaggerUiHtml);
    });
  }

  private configureErrorHandler() {
    this.app.use(
      (
        error: unknown, req: Request, res: Response<ErrorResponseDto>, next: NextFunction,
      ) => ErrorHandler.handleError(error, req, res, next),
    );
  }

  public start() {
    this.app.listen(
      PORT,
      () => logger.info(
        `App started. Swagger UI: http://localhost:${PORT}${SWAGGER_PATH}`,
      ),
    );
  }
}
