import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import * as Seeds from 'src/db/seeds';
import { User, SeedRun, Team, Venue, Game, League, Season, TeamRecord } from 'src/db/entities';
import { ErrorCode, Exception, SeedRunState, UserRole, UserStatus } from 'src/typings';
import { CollegeFootballDataService } from '../college-football-data/college-football-data.service';
import { Logger } from '../logger/logger.service';
import { delay } from 'src/helpers/functions';

@Injectable()
export class SeedingService {
  private readonly logger = new Logger(SeedingService.name);

  constructor(
    private readonly entityManager: EntityManager,
    private readonly collegeFootballApi: CollegeFootballDataService,
  ) {
    this.ensureDefaultUsersExist();
    this.loadCollegeFootballData(new Date().getFullYear());
  }

  async generate<T>(model: any, amount: number): Promise<T[]> {
    const maybeSeed = Seeds[`${model.name}Seeds`];
    if (!maybeSeed)
      throw new Exception(ErrorCode.NoModelSeeds, `no seeds found for ${model.name}. Ensure they exists in db/seeds`);

    const seedrun = await this.entityManager.insert<SeedRun>(SeedRun, { state: SeedRunState.Running });
    let results: T[] = [];
    await this.entityManager.transaction(async (manager) => {
      results = results.concat(await manager.save<T>(await new maybeSeed(amount).create()));
    });

    await this.entityManager.update<SeedRun>(
      SeedRun,
      { id: seedrun.identifiers[0].id },
      { state: SeedRunState.Completed },
    );

    return results;
  }

  /**
   * Ensures that all of our default users are setup and estalished in the users table. This includes our accounts for core staff members and
   * our default testing accounts
   *
   * @author jordanskomer
   * @since 0.0.1
   */
  private async ensureDefaultUsersExist() {
    this.entityManager.transaction(async (manager) => {
      this.logger.verbose('Checking that default users exist');
      let user = await manager.findOne(User, {
        where: { phoneNumber: '+18176004439' },
      });

      if (!user) {
        this.logger.verbose(' Default user (+18176004439) does not exist. creating...');
        user = new User();
        user.name = {
          first: 'Jordan',
          last: 'Skomer',
        };
        user.phoneNumber = '+18176004439';
        user.status = UserStatus.Active;
        user.role = UserRole.LeagueOwner;
        await manager.insert<User>(User, user);
      }

      if (!user.activeLeague) {
        this.logger.verbose(' Default users active league does not exist. creating...');
        const league = new League();
        league.name = 'The Test League';
        league.owner = Promise.resolve(user);
        league.players = Promise.resolve([user]);
        const result = await manager.insert<League>(League, league);
        this.logger.verbose(` Created ${league.name}`, result);
        await manager.update<User>(User, user.id, {
          activeLeague: result.identifiers[0],
        });
      }
    });
  }

  /**
   * Pulls Team info from College Football Data API and ensures they exist in the database
   */
  async loadCollegeFootballData(year: number) {
    this.logger.verbose('Starting College Data sync...');
    await this.loadVenues();
    await this.loadTeams();
    const season = await this.loadSeason(year);
    const games = await this.loadGames(season);
    if (games.length < 0) await this.loadTeamRecords(season);
  }

  private async loadSeason(year: number): Promise<Season> {
    this.logger.verbose(` Loading ${year} Season`);

    const existing = await this.entityManager.findOne(Season, { where: { year } });

    if (!existing) {
      const res = await this.collegeFootballApi.calendar(year);
      const season = this.collegeFootballApi.convert<Season>(Season, res);
      await this.entityManager.save<Season>(season);
      this.logger.verbose(`   Loaded ${year} Season`);
      return season;
    } else {
      this.logger.verbose(`   ${year} Season exists... Skipping`);
      return existing;
    }
  }

  private async loadVenues() {
    this.logger.verbose(` Loading Venues`);
    const start = Date.now();

    const existing = await this.entityManager.find(Venue);

    if (existing.length === 0) {
      const res = await this.collegeFootballApi.venues();

      const venues = res
        .filter((r) => r.country_code === 'US')
        .map((u) => this.collegeFootballApi.convert<Venue>(Venue, u));
      await this.entityManager.save<Venue>(venues);
      this.logger.verbose(`   Loaded ${res.length} Venues in ${Date.now() - start}ms`);
    } else {
      this.logger.verbose('   Already loaded Venues... Skipping');
    }
  }

  private async loadTeams() {
    this.logger.verbose(` Loading Teams`);
    const start = Date.now();

    const existing = await this.entityManager.find(Team);

    if (existing.length === 0) {
      const res = await this.collegeFootballApi.teams();
      const teams = res.map((t) => {
        const team = this.collegeFootballApi.convert<Team>(Team, t);
        team.stadium = this.entityManager.findOneOrFail(Venue, { where: { espnId: t.location.venue_id } });
        return team;
      });
      await this.entityManager.save<Team>(teams);
      this.logger.verbose(`   Loaded ${res.length} Teams in ${Date.now() - start}ms`);
    } else {
      this.logger.verbose('   Already loaded Teams... Skipping');
    }
  }

  private async loadGames(season: Season) {
    this.logger.verbose(` Loading Games`);
    const apiGames = await this.collegeFootballApi.games(season.year);
    const newGames: Game[] = [];

    await this.entityManager.transaction(async (manager) => {
      for (let i = apiGames.length - 1; i >= 0; i--) {
        const game = this.collegeFootballApi.convert<Game>(Game, apiGames[i]);
        const existingGame = await manager.findOne(Game, {
          where: { espnId: apiGames[i].id },
        });
        if (!existingGame) {
          try {
            game.season = Promise.resolve(season);
            game.venue = await manager.findOneOrFail(Venue, {
              where: { espnId: apiGames[i].venue_id },
            });
            game.homeTeam = await manager.findOneOrFail(Team, {
              where: { espnId: apiGames[i].home_id },
            });
            game.awayTeam = await manager.findOneOrFail(Team, {
              where: { espnId: apiGames[i].away_id },
            });

            newGames.push(game);
          } catch (e) {
            // this.logger.error(`Could not create game #${apiGames[i].id} - ${e.message}`);
          }
        }
      }
      newGames.length && manager.insert(Game, newGames);
    });

    this.logger.verbose(`   Added ${newGames.length} Games to ${season.year}`);
    return newGames;
  }

  private async loadTeamRecords(season: Season) {
    this.logger.verbose(` Loading Team records`);
    const teams = await this.entityManager.find(Team);

    await this.entityManager.transaction(async (manager) => {
      const newRecords: TeamRecord[] = [];
      for (let i = 0; i < teams.length; i++) {
        const team = teams[i];
        const res = await this.collegeFootballApi.records(season.year, team.name);
        const apiRecord = this.collegeFootballApi.convert<TeamRecord>(TeamRecord, res[0]);

        try {
          const record = await manager.findOneOrFail(TeamRecord, { where: { team } });
          await manager.update(TeamRecord, record, apiRecord);
        } catch {
          apiRecord.team = team;
          apiRecord.season = season;
          newRecords.push(apiRecord);
        }

        // So we don't pound the api
        await delay(0.2);
      }

      newRecords.length && (await manager.insert(TeamRecord, newRecords));

      this.logger.verbose(`   Added ${newRecords.length} new Team records`);
    });
  }
}
