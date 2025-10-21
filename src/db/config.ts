import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as e from './entities';
import * as m from './migrations';
import * as s from './subscribers';

export const entities = Object.values(e);
export const migrations = Object.values(m);
export const subscribers = Object.values(s);

export const config: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: false,
  migrationsRun: true,
  logging: false,
  keepConnectionAlive: true,
  cli: {
    entitiesDir: 'src/typings/models',
    migrationsDir: 'src/db/migrations',
  },
  dropSchema: false,
  migrations,
  entities,
  subscribers,
};

export default config;
