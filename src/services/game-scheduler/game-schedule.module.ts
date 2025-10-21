import { Module } from '@nestjs/common';
import { CollegeFootballDataModule } from '../college-football-data';
import { GameSchedulerService } from './game-scheduler.service';

@Module({
  imports: [CollegeFootballDataModule],
  providers: [GameSchedulerService],
  exports: [GameSchedulerService],
})
export class GameSchedulerModule {}
