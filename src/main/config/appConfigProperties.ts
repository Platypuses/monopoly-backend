import dotenv from 'dotenv';

dotenv.config();

export const PORT = parseInt(process.env.PORT || '8080', 10);
export const LOG_LEVEL = process.env.LOG_LEVEL || 'INFO';
export const SWAGGER_PATH = process.env.SWAGGER_PATH || '/swagger-ui/';
export const POSTGRES_DB_HOST = process.env.POSTGRES_DB_HOST || 'localhost';

export const POSTGRES_DB_PORT = parseInt(
  process.env.POSTGRES_DB_PORT || '5432',
  10
);

export const POSTGRES_DB_USERNAME =
  process.env.POSTGRES_DB_USERNAME || 'postgres';

export const POSTGRES_DB_PASSWORD =
  process.env.POSTGRES_DB_PASSWORD || 'postgres';

export const POSTGRES_DB_NAME = process.env.POSTGRES_DB_NAME || 'monopoly';
