import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { GameTotals, NanoIdEntity } from './abstract';
import { Season } from './season.entity';
import { Team } from './team.entity';

@Entity('team_records')
export class TeamRecord extends NanoIdEntity {
  @Column(() => GameTotals)
  total: GameTotals;

  @Column(() => GameTotals)
  conferenceGames: GameTotals;

  @Column(() => GameTotals)
  homeGames: GameTotals;

  @Column(() => GameTotals)
  awayGames: GameTotals;

  @ManyToOne(() => Team, (v) => v.records)
  @JoinColumn()
  team: Team;

  @ManyToOne(() => Season, (s) => s.records)
  @JoinColumn()
  season: Season;
}
