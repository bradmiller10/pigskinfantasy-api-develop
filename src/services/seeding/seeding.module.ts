import { Module } from '@nestjs/common';

import { CollegeFootballDataModule } from '../college-football-data';
import { SeedingService } from './seeding.service';

@Module({
  imports: [CollegeFootballDataModule],
  providers: [SeedingService],
  exports: [SeedingService],
})
export class SeedingModule {}
