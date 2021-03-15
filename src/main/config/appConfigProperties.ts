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

export const ACCESS_TOKEN_SIGN_KEY =
  process.env.ACCESS_TOKEN_SIGN_KEY ||
  'hN1LJcOlxW9xfQXzz6SFiHeFxWqK9Jk55KjJK3F8+IOXQ5Zh4eFP0se38B' +
    'nidUxDwNMafeY+ZNJKNpEIPAlcf1uiP1KpjIPJx+BAXH9mG5fEmEJDU5u8' +
    'Y7rnrctayEcHQKbXe6g9k1sPap5XSgVzs6iiHskoFa86nCuKai63c1ar6c' +
    'pF/BXqFSYCSH6I7lRaXH1wCbuCxILqFF+u+T8xx+S0tAGFmTZhkDmLRg==';

export const REFRESH_TOKEN_SIGN_KEY =
  process.env.REFRESH_TOKEN_SIGN_KEY ||
  'ZeE7ZKCxunlMQ9XyiSEzzan34hWhcegKVjT89yr8Dq/1CRCPtV3amPFJFR' +
    'P5kqHiIGFCbgTt1lDObZ5bcqvbPgyJxoQbZFlEkZHRdA1+uAddAXXfIvws' +
    'GdqyiXuyNWox9zuqhPSD8Kw3yu2yhJSY/Y0DAe+bFMLPBD9ZjZocIZZO2k' +
    'tReI6os9NTTPdd6aJC/CotRmTbC9smIbHmbVhG+kcvgiOD7iIC3+ogSw==';

export const ACCESS_TOKEN_LIFETIME = process.env.ACCESS_TOKEN_LIFETIME || '2h';
export const REFRESH_TOKEN_LIFETIME =
  process.env.REFRESH_TOKEN_LIFETIME || '30d';

export const ACCESS_TOKEN_HEADER =
  process.env.ACCESS_TOKEN_HEADER || 'Authorization';
