import { Test, TestingModule } from '@nestjs/testing';
import { GameSchedulerService } from './game-scheduler.service';

describe('GameSchedulerService', () => {
  let service: GameSchedulerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameSchedulerService],
    }).compile();

    service = module.get<GameSchedulerService>(GameSchedulerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
