import { Test, TestingModule } from '@nestjs/testing';
import { CollegeFootballDataService } from './college-football-data.service';

describe('CollegeFootballDataService', () => {
  let service: CollegeFootballDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CollegeFootballDataService],
    }).compile();

    service = module.get<CollegeFootballDataService>(CollegeFootballDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
