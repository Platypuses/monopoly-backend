import 'reflect-metadata';
import express, { Express } from 'express';
import { PORT, SWAGGER_PATH } from './main/config/appConfigProperties';
import logger from './main/config/logger';
import configureServer from './configureServer';

export default class Server {
  private readonly app: Express;

  constructor() {
    this.app = express();
  }

  public async configure(): Promise<void> {
    await configureServer(this.app);
  }

  public start(): void {
    this.app.listen(PORT, () =>
      logger.info(
        `App started. Swagger UI: http://localhost:${PORT}${SWAGGER_PATH}`
      )
    );
  }
}
