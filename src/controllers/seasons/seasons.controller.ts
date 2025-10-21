import { Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { InjectEntity, RepositoryService } from 'src/services/respository';
import { Game, Season } from 'src/db/entities';
import { Owners, Users } from 'src/helpers/decorators';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('seasons')
@ApiBearerAuth()
@Users()
@Controller('seasons')
export class SeasonsController {
  private currentYear: number;
  constructor(
    @InjectEntity(Game) private gamesRepository: RepositoryService<Game>,
    @InjectEntity(Season) private seasonsRepository: RepositoryService<Season>,
  ) {}

  @Get('')
  @Owners()
  findAll() {
    return this.seasonsRepository.findAll();
  }

  @Get(':year')
  @Owners()
  findById(@Param('year') id: number) {
    return this.seasonsRepository.findOneBy('year', id);
  }

  @Get(':year/games')
  async findAllGamesByYear(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Param('year') year: number,
  ) {
    return this.gamesRepository.paginate(page, limit, { where: { season: { year } } });
  }

  @Get(':year/:week/games')
  async findGamesByWeek(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Param('year') year: number,
    @Param('week') week: number,
  ) {
    return this.gamesRepository.paginate(page, limit, { where: { season: { year }, week } });
  }

  @Get('current')
  findByCurrentYear() {
    return this.seasonsRepository.findOneBy('year', this.getCurrentYear());
  }

  @Get('current/games')
  async findAllGamesByCurrentYear(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ) {
    const season = await this.findByCurrentYear();
    return this.gamesRepository.paginate(page, limit, {
      where: { season: { year: season.year }, week: season.currentWeek },
      order: { startsAt: 'ASC' },
    });
  }

  @Get('current/:week/games')
  async findAllGamesByCurrentYearAndWeek(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Param('week') week: number,
  ) {
    return this.gamesRepository.paginate(page, limit, { where: { season: { year: this.getCurrentYear() }, week } });
  }

  private getCurrentYear(): number {
    return new Date().getFullYear();
  }
}
