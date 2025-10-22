import { HttpService, Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { Game, Score, Season, Team, TeamRecord, Venue } from 'src/db/entities';
import { Country, State } from 'src/typings';
import { EntityTarget } from 'typeorm';
import {
  CollegeFootballDataBettingLineDto,
  CollegeFootballDataGameDto,
  CollegeFootballDataLocationDto,
  CollegeFootballDataRecordDto,
  CollegeFootballDataTeamDto,
} from './dto';
import { CollegeFootballDataCalendarDto } from './dto/calendar.dto';
import { Error } from './exceptions/error.exception';

type ConvertableDto =
  | CollegeFootballDataTeamDto
  | CollegeFootballDataLocationDto
  | CollegeFootballDataGameDto
  | CollegeFootballDataCalendarDto[]
  | CollegeFootballDataRecordDto;
@Injectable()
export class CollegeFootballDataService {
  private currentYear: number;
  constructor(private $: HttpService) {
    this.currentYear = DateTime.now().year;
  }

  /**
   * Retrieves Team information
   *
   * @param fbs - True or false if returning major division teams from this current year
   * @param conference - A specific conferences abbreviation filter
   * @returns {CollegeFootballDataTeamDto[]} - Array of teams matching the query
   * @docs https://api.collegefootballdata.com/api/docs/?url=/api-docs.json#/teams/getTeams
   */
  public async teams(): Promise<CollegeFootballDataTeamDto[]> {
    return this.get<CollegeFootballDataTeamDto>('teams/fbs');
  }

  public async venues(): Promise<CollegeFootballDataLocationDto[]> {
    return this.get<CollegeFootballDataLocationDto>('venues');
  }
  public async games(year?: number): Promise<CollegeFootballDataGameDto[]> {
    return this.get<CollegeFootballDataGameDto>('games', { year: year || this.currentYear, seasonType: 'regular' });
  }

  /**
   * Retrieves a specific game by it's ESPN id
   *
   * @param id - The ESPN id of the game to retrieve
   * @param {optional} year - The year to retrieve the game from (shouldn't be required but is from the api)
   * @returns {CollegeFootballDataGameDto} - The game retrieved from the id
   * @since 0.0.1
   * @author jordanskomer
   */
  public async game(id: number, year?: number): Promise<CollegeFootballDataGameDto> {
    const games = await this.get<CollegeFootballDataGameDto>('games', { year: year || this.currentYear, id });
    return games[0];
  }

  public async calendar(year?: number): Promise<CollegeFootballDataCalendarDto[]> {
    return this.get<CollegeFootballDataCalendarDto>('calendar', { year: year || this.currentYear });
  }

  public async records(year?: number, teamName?: string): Promise<CollegeFootballDataRecordDto[]> {
    return this.get<CollegeFootballDataRecordDto>('records', {
      year: year || this.currentYear,
      team: teamName.split(' ').join('+'),
    });
  }

  /**
   * Returns betting lines and data. This endpoint is updated every 15minutes
   * @param gameId
   * @param {number=} year
   * @returns
   * @docs https://api.collegefootballdata.com/api/docs/?url=/api-docs.json#/betting/getLines
   */
  public async bettingsLines(gameId: number, year?: number): Promise<CollegeFootballDataBettingLineDto> {
    const line = await this.get<CollegeFootballDataBettingLineDto>('betting/lines', {
      year: year || this.currentYear,
      gameId,
    })[0];
    // Remove all of the betting line data as we don't currently usethis
    delete line.lines;
    return line;
  }

  public convert<T>(type: EntityTarget<T>, dto: ConvertableDto): T {
    const entityType = type['name'];
    if (entityType === 'undefined')
      throw new Error(`Attempted to call convert without passing the return type. convert<TypeName>(dto)`);

    if (typeof dto === 'undefined') return null;

    if (entityType === Team['name']) {
      const teamDto = dto as unknown as CollegeFootballDataTeamDto;
      const team = new Team();
      team.espnId = teamDto.id;
      team.name = teamDto.school;
      team.altName = teamDto.alt_name_2;
      team.abbreviation = teamDto.abbreviation;
      team.conference = teamDto.conference;
      team.division = teamDto.division;
      team.color = teamDto.color;
      team.mascot = teamDto.mascot;
      if (Array.isArray(teamDto.logos)) team.logo = teamDto.logos[0];

      return team as unknown as T;
    } else if (entityType === Venue['name']) {
      const venueDto = dto as unknown as CollegeFootballDataLocationDto;
      const venue = new Venue();
      venue.espnId = venueDto.id;
      venue.name = venueDto.name;
      venue.hasADome = venueDto.dome || false;
      venue.isGrass = venueDto.grass || false;
      venue.yearBuilt = venueDto.year || 0;
      venue.location = {
        city: venueDto.city,
        state: venueDto.state as State,
        country: venueDto.country_code as Country,
        zipcode: Number(venueDto.zip),
        latitude: venueDto.location?.x,
        longtitude: venueDto.location?.y,
      };

      return venue as unknown as T;
    } else if (Array.isArray(dto) && entityType === Season['name']) {
      const calendarDto = dto as unknown as CollegeFootballDataCalendarDto[];
      const season = new Season();
      const regular = calendarDto.filter((dto) => dto.seasonType === 'regular');
      season.year = this.currentYear;
      season.startsAt = regular[0].firstGameStart;
      season.endsAt = regular[regular.length - 1].lastGameStart;
      season.weeks = regular.length;
      return season as unknown as T;
    } else if (entityType === Game['name']) {
      const gameDto = dto as unknown as CollegeFootballDataGameDto;
      const game = new Game();
      game.espnId = gameDto.id;
      game.week = gameDto.week;
      game.highlightYouTubeUrl = gameDto.highlights;
      game.home = this.convertScores('home', gameDto);
      game.away = this.convertScores('away', gameDto);
      if (gameDto.start_date) game.startsAt = new Date(gameDto.start_date);
      game.homeWinProbability = gameDto.home_post_win_prob;
      game.awayWinProbability = gameDto.away_post_win_prob;
      game.attendanceTotal = gameDto.attendance || 0;
      game.isConferenceGame = gameDto.conference_game;
      return game as unknown as T;
    } else if (entityType === TeamRecord['name']) {
      const recordDto = dto as unknown as CollegeFootballDataRecordDto;
      const record = new TeamRecord();
      record.total = recordDto.total;
      record.homeGames = recordDto.homeGames;
      record.awayGames = recordDto.awayGames;
      record.conferenceGames = record.conferenceGames;
      return record as unknown as T;
    }

    throw new Error(`${entityType} could not be converted`, dto);
  }

  private convertScores(is: 'home' | 'away', dto: CollegeFootballDataGameDto): Score {
    const line_scores = dto[`${is}_line_scores`] as number[];
    return {
      totalScore: dto[`${is}_points`] || 0,
      firstQuarterScore: line_scores && line_scores[0] ? line_scores[0] : undefined,
      secondQuarterScore: line_scores && line_scores[1] ? line_scores[1] : undefined,
      thirdQuarterScore: line_scores && line_scores[2] ? line_scores[2] : undefined,
      fourthQuarterScore: line_scores && line_scores[3] ? line_scores[3] : undefined,
    };
  }

  private async get<Dto>(endpoint: string, query?: Record<string, string | number>): Promise<Dto[]> {
    const url = `${endpoint}${
      query
        ? '?' +
          Object.keys(query)
            .map((key) => `${key}=${query[key]}`)
            .join('&')
        : ''
    }`;

   try {
  const API_KEY = process.env.CFB_API_KEY;
const response = await this.$.get(url, {
  baseURL: 'https://api.collegefootballdata.com/',
  headers: { Authorization: `Bearer ${API_KEY}` },
}).toPromise();


  return response.data as Dto[];
} catch (e) {
  throw new Error(`Error from ${url} - ${e.message}`, e);
}

