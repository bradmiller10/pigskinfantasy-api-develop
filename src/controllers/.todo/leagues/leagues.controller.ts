import { DeepPartial } from 'typeorm';
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LeagueOwners, Owners, Users } from 'src/helpers/decorators';
import { Draft, User } from 'src/db/entities';
import { CreateLeagueDto, UpdateLeagueDto, UpdateDraftDto, CreatePlayersDto, CreateDraftDto } from './dto';
import { UserStatus } from 'src/typings';
import { LeaguesService } from './leagues.service';
import { UsersService } from '../users/users.service';
import { DraftsService } from './drafts.service';

@ApiBearerAuth()
@ApiTags('leagues')
@Controller('leagues')
export class LeaguesController {
  constructor(
    private readonly leaguesService: LeaguesService,
    private readonly draftsService: DraftsService,
    private readonly usersService: UsersService,
  ) {}

  @Owners()
  @Post()
  create(@Body() createLeagueDto: CreateLeagueDto) {
    return this.leaguesService.create(createLeagueDto);
  }

  @Owners()
  @Get()
  findAll() {
    return this.leaguesService.findAll();
  }

  @Users()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leaguesService.findOne(+id, { relations: ['draft'] });
  }

  @LeagueOwners()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLeagueDto: UpdateLeagueDto) {
    return this.leaguesService.update(+id, updateLeagueDto);
  }

  @Owners()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.leaguesService.remove(+id);
  }

  @LeagueOwners()
  @Post(':id/players')
  createPlayers(@Param('id') id: string, @Body() dtos: CreatePlayersDto[]) {
    return this.usersService.create(
      dtos.map((dto) =>
        Object.assign<DeepPartial<User>, CreatePlayersDto>({ leagues: [{ id: +id }], status: UserStatus.Active }, dto),
      ),
    );
  }

  @LeagueOwners()
  @Post(':id/drafts')
  createDraft(@Param('id') id: string, @Body() dto: CreateDraftDto) {
    return this.draftsService.create(
      Object.assign<DeepPartial<Draft>, CreateDraftDto>(
        {
          league: { id: +id },
        },
        dto,
      ),
    );
  }

  @LeagueOwners()
  @Patch(':id/drafts/:draftId')
  updateDraft(@Param('draftId') draftId: string, @Body() dto: UpdateDraftDto) {
    return this.draftsService.update(draftId, dto);
  }
}
