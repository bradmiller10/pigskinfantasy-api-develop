import { Module } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { UsersService } from '../users/users.service';
import { DraftsService } from './drafts.service';
import { LeaguesController } from './leagues.controller';
import { LeaguesService } from './leagues.service';

@Module({
  providers: [LeaguesService, DraftsService],
  imports: [UsersService, EntityManager],
  exports: [LeaguesService, DraftsService],
  controllers: [LeaguesController],
})
export class LeaguesModule {}
