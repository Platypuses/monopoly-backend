import Server from './Server';
import logger from './main/config/logger';

const server = new Server();

server
  .configure()
  .then(() => server.start())
  .catch((error) => logger.error(error));
