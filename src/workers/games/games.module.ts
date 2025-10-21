import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RedisServiceType } from 'src/typings';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: RedisServiceType.Games,
        transport: Transport.REDIS,
        options: {
          url: `redis://${process.env.REDIS_HOST || 'localhost'}:6379`,
        },
      },
    ]),
  ],
  providers: [GamesService],
  exports: [GamesService],
  controllers: [GamesController],
})
export class GamesModule {}
