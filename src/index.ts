import express from 'express';
import bodyParser from 'body-parser';
import { PORT, SWAGGER_PATH } from './config/appConfig';
import logger from './config/logger';
// eslint-disable-next-line node/no-unpublished-import
import { RegisterRoutes } from '../tsoa/routes';
import ConfigureSwaggerUI from './config/ConfigureSwaggerUI';

const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
  bodyParser.json(),
);

ConfigureSwaggerUI(app);
RegisterRoutes(app);

app.listen(PORT, () => logger.info(`App started. Swagger UI: http://localhost:${PORT}${SWAGGER_PATH}`));
