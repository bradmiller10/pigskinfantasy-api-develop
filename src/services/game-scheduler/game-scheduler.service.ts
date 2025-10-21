import { Injectable } from '@nestjs/common';
import { CronExpression, Interval, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { DateTime } from 'luxon';
import { Game } from 'src/db/entities';
import { CollegeFootballDataService } from '../college-football-data/college-football-data.service';
import { Logger } from '../logger/logger.service';
import { InjectEntity, RepositoryService } from '../respository';

/**
 * The amount of minutes we use to determine how often new data should be
 * fetched for games that are currently live. This is determined currently
 * by the college football api
 *
 * @see https://collegefootballdata.com/about
 * @since 0.0.1
 * @author jordanskomer
 */
const INTERVAL = 15;

@Injectable()
export class GameSchedulerService {
  private logger = new Logger(GameSchedulerService.name);
  constructor(
    private schedulerRegister: SchedulerRegistry,
    private collegeFootballData: CollegeFootballDataService,
    @InjectEntity(Game) private gamesRepository: RepositoryService<Game>,
  ) {
    this.logger.verbose('Setup');
  }

  schedule(game: Game) {
    this.schedulerRegister.addCronJob(this.name(game), this.createJob(game));
  }

  private createJob(game: Game): CronJob {
    return new CronJob(`${INTERVAL} * * * *`, async () => {
      const gameRes = await this.collegeFootballData.game(game.espnId);
      // Once each score has been loaded into the game from the api we can assume the game is completed since this api only
      // updates upon game completions
      if (gameRes.home_line_scores.length === 4 && gameRes.away_line_scores.length === 4) {
        this.logger.verbose(`${game.nanoid} has finished. Performing final update`, gameRes);
        this.schedulerRegister.deleteCronJob(this.name(game));
        this.gamesRepository.update(game.id, {
          ...this.collegeFootballData.convert<Game>(Game, gameRes),
          isFinished: true,
        });
      } else {
        const betting = await this.collegeFootballData.bettingsLines(game.espnId);
        this.logger.verbose(`${game.nanoid} is live. Updating with most recent info`, betting);
        this.gamesRepository.update(game.id, {
          home: {
            totalScore: betting.homeScore,
          },
          away: {
            totalScore: betting.awayScore,
          },
        });
      }
    });
  }

  /**
   * Runs every 15 minutes to ensure games that are about to start have CRON jobs scheduled
   *
   * @since 0.0.1
   * @author jordanskomer
   */
  @Interval('game-scheduler', 900000)
  async scheduleJobs() {
    this.logger.verbose(`Checking if there are any games to be scheduled for updates...`);
    const games = await Game.findByYear(DateTime.now().year);
    const jobs = this.schedulerRegister.getCronJobs();
    const gamesWithoutJobs = games.filter((game) => !jobs.has(this.name(game)));

    if (gamesWithoutJobs.length) {
      this.logger.verbose(`Found ${gamesWithoutJobs.length} games to schedule`);
      gamesWithoutJobs.map((game) => {
        if (this.shouldSchedule(game.startsAt)) {
          this.logger.verbose(`Setting up CronJob for ${game.id}`, game.startsAt);
          this.schedule(game);
        }
      });
    } else {
      this.logger.verbose('No games needed to schedule');
    }
  }

  /**
   * Determines if a job should be scheduled if the startsAt time is with the set INTERVAL of the current time
   *
   * @param {Date} startsAt - The starts at date from a Game
   * @returns {boolean} - True if it should be scheduled, false otherwise
   * @since 0.0.1
   * @author jordanskomer
   */
  private shouldSchedule(startsAt: Date): boolean {
    const start = DateTime.fromJSDate(startsAt);
    const diff = start.diffNow();
    return diff.hours === 0 && diff.minutes >= INTERVAL;
  }

  /**
   * Creates the name of the CRON Job to be scheduled
   * @param gameId - The game id from the database
   * @returns {string} - The name of the cron job in game_gameId format
   * @since 0.0.1
   * @author jordanskomer
   */
  private name(game: Game): string {
    return `game_${game.nanoid}`;
  }
}
