import { DateTime } from 'luxon';
import { GameStatus, GameStatuses } from 'src/typings';
import { BeforeInsert, BeforeUpdate, Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Score } from './abstract';
import { CollegeFootballEntity } from './abstract/college-football.entity';
import { Season } from './season.entity';
import { Team } from './team.entity';
import { Venue } from './venue.entity';

const TABLE = 'games';
@Entity(TABLE)
export class Game extends CollegeFootballEntity {
  @Index()
  @Column()
  week: number;

  @Column('timestamp')
  startsAt: Date;

  @Column({ type: 'int', default: 0 })
  attendanceTotal: number;

  @Column({ type: 'bool', default: false })
  isConferenceGame: boolean;

  @Column({ type: 'enum', enum: GameStatus, default: GameStatus.Upcoming })
  status: GameStatus;

  @Column(() => Score)
  home: Score;

  @Column(() => Score)
  away: Score;

  @Column({ type: 'float', nullable: true })
  homeWinProbability?: number;

  @Column({ type: 'float', nullable: true })
  awayWinProbability?: number;

  @Column({ type: 'varchar', nullable: true })
  highlightYouTubeUrl?: string;

  @Column({ type: 'bool', default: false })
  isFinished: boolean;

  @ManyToOne(() => Team, (t) => t.homeGames, { eager: true })
  @JoinColumn()
  homeTeam: Team;

  @ManyToOne(() => Team, (t) => t.awayGames, { eager: true })
  @JoinColumn()
  awayTeam: Team;

  @ManyToOne(() => Venue, (v) => v.games)
  @JoinColumn()
  venue: Venue;

  @ManyToOne(() => Season, (s) => s.games)
  @JoinColumn()
  season: Promise<Season>;

  /**
   * Used to find a teams home and away games
   *
   * @param teamId - The team id to find games associated with
   * @since 0.0.1
   * @author jordanskomer
   */
  static findByTeam(teamId: number) {
    return this.createQueryBuilder(TABLE)
      .where('games.homeTeam = :teamId', { teamId })
      .orWhere('games.awayTeam = :teamId', { teamId })
      .getMany();
  }

  /**
   * Returns a query for finding games that match the passed in year
   * @param year - The year to search for
   * @example findByYear(2021)
   * @since 0.0.1
   * @author jordanskomer
   */
  static findByYear(year: number) {
    return this.createQueryBuilder(TABLE).where('games.season.year = :year', { year }).getMany();
  }

  /**
   * Checks if the games startsAt is less than the current date
   *
   * @since 0.0.1
   * @returns {boolean} - True if the game has started, false otherwise
   */
  private hasStarted() {
    return this.startsAt > new Date();
  }

  private isQuarter(quarterToTest: keyof GameStatus): boolean {
    // Keys are in FirstQuarter type format, so we can convert to firstQuarter to determine score from data
    const key = `${quarterToTest.toString().charAt(0).toLowerCase()}${quarterToTest.toString().slice(1)}Score`;

    return this.home[key] !== null || this.away[key] !== null;
  }

  @BeforeInsert()
  @BeforeUpdate()
  setGameStatus() {
    if (this.status !== GameStatus.FirstQuarter && this.hasStarted()) {
      this.status = GameStatus.FirstQuarter;
    } else {
      for (let i = GameStatuses.length - 1; i >= 0; i--) {
        const status = GameStatus[GameStatuses[i]];
        if (this.status !== status && this.isQuarter(status)) {
          this.status = status;
          return;
        }
      }
    }
  }
}
