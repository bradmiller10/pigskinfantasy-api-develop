import { HttpModule, Module } from '@nestjs/common';
import { CollegeFootballDataService } from './college-football-data.service';

export const CURRENT_YEAR = 'CURRENT_YEAR';
@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 1,
      baseURL: 'https://api.collegefootballdata.com/',
      headers: {
        Authorization: `Bearer ${process.env.COLLEGE_FOOTBALL_DATA_API_KEY}`,
      },
    }),
  ],
  providers: [CollegeFootballDataService],
  exports: [CollegeFootballDataService],
})
export class CollegeFootballDataModule {}
