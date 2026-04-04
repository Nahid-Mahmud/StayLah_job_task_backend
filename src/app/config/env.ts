import dotenv from 'dotenv';

dotenv.config();

interface EnvVariables {
  PORT: string;
  DATABASE_URL: string;
  NODE_ENV: 'development' | 'production' | 'test';
  FRONTEND_URL: string;
  REDIS_HOST: string;
  REDIS_PORT: string;
}

const loadEnvVariable = (): EnvVariables => {
  const requiredEnvVariables = [
    'PORT',
    'DATABASE_URL',
    'NODE_ENV',
    'FRONTEND_URL',
    'REDIS_HOST',
    'REDIS_PORT',
  ];

  requiredEnvVariables.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  });

  let databaseUrl = process.env.DATABASE_URL as string;

  if (process.env.NODE_ENV === 'test') {
    if (!process.env.TEST_DB_URI) {
      throw new Error('Missing required environment variable: TEST_DB_URI');
    }
    databaseUrl = process.env.TEST_DB_URI as string;
  }

  return {
    PORT: process.env.PORT as string,
    DATABASE_URL: databaseUrl,
    NODE_ENV: process.env.NODE_ENV as 'development' | 'production' | 'test',
    FRONTEND_URL: process.env.FRONTEND_URL as string,
    REDIS_HOST: process.env.REDIS_HOST as string,
    REDIS_PORT: process.env.REDIS_PORT as string,
  };
};

const envVariables = loadEnvVariable();
export default envVariables;
