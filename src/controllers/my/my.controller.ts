import { Controller, Get, Param, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';
import { InjectEntity, RepositoryService } from 'src/services/respository';
import { Game, League, User } from 'src/db/entities';
import { Users } from 'src/helpers/decorators';
import { Logger } from 'src/services/logger';

@ApiTags('my')
@ApiBearerAuth()
@Users()
@Controller('my')
export class MyController {
  logger = new Logger(MyController.name);
  constructor(
    @InjectEntity(Game) private gamesRepository: RepositoryService<Game>,
    @InjectEntity(User) private usersRepository: RepositoryService<User>,
    @InjectEntity(League) private leaguesRepository: RepositoryService<League>,
  ) {}

  @Get('profile')
  findMyProfile(@Request() req: FastifyRequest) {
    return this.usersRepository.findOne(req.user.id, { loadRelationIds: true });
  }

  @Get('league')
  findMyLeague(@Request() req: FastifyRequest) {
    return this.leaguesRepository.findOne(req.user.activeLeague as unknown as number);
  }
}
