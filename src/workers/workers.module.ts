import { Module } from '@nestjs/common';
import { GamesModule } from './games';

@Module({
  imports: [GamesModule],
})
export class WorkersModule {}
