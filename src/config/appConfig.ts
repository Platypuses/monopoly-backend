import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 8080;
export const LOG_LEVEL = process.env.LOG_LEVEL || 'INFO';
export const SWAGGER_PATH = process.env.SWAGGER_PATH || '/swagger-ui/';
