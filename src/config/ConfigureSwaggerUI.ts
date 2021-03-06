import swaggerUi from 'swagger-ui-express';
import { Express, Request, Response } from 'express';
import { SWAGGER_PATH } from './appConfig';

export default function ConfigureSwaggerUI(app: Express): void {
  app.use(SWAGGER_PATH, swaggerUi.serve, async (_req: Request, res: Response) => {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax,node/no-unpublished-import
    const swaggerUiHtml = swaggerUi.generateHTML(await import('../../tsoa/swagger.json'));

    res.send(swaggerUiHtml);
  });
}
