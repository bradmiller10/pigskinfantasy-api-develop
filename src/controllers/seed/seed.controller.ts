import { Body, Controller, Logger, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { entities } from 'src/db';
import { Owners } from 'src/helpers/decorators';
import { SeedingService } from 'src/services/seeding/seeding.service';
import { ErrorCode } from 'src/typings/enums';
import { Exception } from 'src/typings/exceptions';
import { CreateSeedDto } from './dto/createSeed.dto';

@ApiTags('seed')
@ApiBearerAuth()
@Controller('seed')
@Owners()
export class SeedController {
  private readonly logger = new Logger(SeedController.name);

  constructor(private readonly seedingService: SeedingService) {}

  @Post()
  async seed(@Body() body: CreateSeedDto) {
    for (let i = entities.length - 1; i >= 0; i--) {
      if (entities[i].name === body.entityName) {
        const model = entities[i];
        return await this.seedingService.generate<typeof model>(model, body.amount);
      }
    }

    throw new Exception(ErrorCode.NoModelSeeds, `${body.entityName} is not a valid entity`);
  }
  @Post('season/:year')
  async loadSeason(@Param('year') year: number) {
    return this.seedingService.loadCollegeFootballData(year);
  }
}
