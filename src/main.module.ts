import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { config } from 'src/db/config';
import { Logger } from 'src/services/logger/logger.service';

import { SeedModule } from 'src/controllers/seed/seed.module';
import { RoutesModule } from './controllers/routes.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from './services/cache/cache.module';
import { RepositoryModule } from './services/respository';
import { GameSchedulerModule } from './services/game-scheduler/game-schedule.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      // This will load our .env in every module so we don't have to import it everytime
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    SeedModule.register(),
    TypeOrmModule.forRoot(config),
    RepositoryModule.forRoot(),
    Logger,
    RoutesModule,
    CacheModule,
    GameSchedulerModule,
    // WorkersModule,
  ],
})
export class MainModule {}
