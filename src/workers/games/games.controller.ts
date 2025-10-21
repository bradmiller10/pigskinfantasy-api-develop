import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RedisContext } from '@nestjs/microservices';
import { RedisPublishEventType } from 'src/typings';

@Controller('games')
export class GamesController {
  @MessagePattern(RedisPublishEventType.UpdateGame)
  updateGame(@Payload() gameId: number, @Ctx() context: RedisContext) {
    console.log(`Channel : ${context.getChannel()}`);
  }
}
