import { Controller, Get, Param } from '@nestjs/common';
import { InjectEntity, RepositoryService } from 'src/services/respository';
import { Game } from 'src/db/entities';
import { Users } from 'src/helpers/decorators';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('games')
@ApiBearerAuth()
@Users()
@Controller('games')
export class GamesController {
  constructor(@InjectEntity(Game) private gamesRepository: RepositoryService<Game>) {}

  @Get('/week/:week')
  findAllByWeek(@Param('week') week: number) {
    return this.gamesRepository.findAll({ where: { week }, order: { startsAt: 'ASC' } });
  }

  @Get(':id')
  findById(@Param('id') id: number) {
    return this.gamesRepository.findOne(id);
  }
}
