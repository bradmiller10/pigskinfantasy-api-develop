import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Logger } from 'src/services/logger/logger.service';
import { RedisPublishEventType, RedisServiceType } from 'src/typings';

@Injectable()
export class GamesService {
  private logger = new Logger(GamesService.name);
  private isConnected: boolean;
  constructor(@Inject(RedisServiceType.Games) private client: ClientProxy) {
    this.connect();
  }

  async watch(gameId: number) {}

  async publish(event: RedisPublishEventType, payload?: Record<string, unknown>) {
    this.client.emit(event, payload);
  }

  private connect() {
    this.client
      .connect()
      .then(() => (this.isConnected = true))
      .catch((e) => {
        this.logger.error(e, 'connect');
        this.isConnected = false;
      });
  }
}
