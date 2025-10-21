import { Column, Entity, OneToMany } from 'typeorm';
import { Location } from './abstract';
import { CollegeFootballEntity } from './abstract/college-football.entity';
import { Game } from './game.entity';
import { Team } from './team.entity';

@Entity('venues')
export class Venue extends CollegeFootballEntity {
  @Column()
  name: string;

  @Column({ type: 'bool', default: false })
  isGrass: boolean;

  @Column({ type: 'bool', default: false })
  hasADome: boolean;

  @Column(() => Location)
  location: Location;

  @Column()
  yearBuilt: number;

  @OneToMany(() => Team, (t) => t.stadium)
  teams: Promise<Team[]>;

  @OneToMany(() => Game, (g) => g.venue, { nullable: true })
  games: Promise<Game[]>;
}
