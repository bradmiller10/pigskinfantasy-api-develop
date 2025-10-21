import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CollegeFootballEntity } from './abstract/college-football.entity';
import { DraftPick } from './draft-pick.entity';
import { Game } from './game.entity';
import { TeamRecord } from './team-record.entity';
import { Venue } from './venue.entity';

@Entity('teams')
export class Team extends CollegeFootballEntity {
  @Column()
  name: string;

  @Column()
  abbreviation: string;

  @Column()
  color: string;

  @Column()
  conference: string;

  @Column()
  logo: string;

  @Column({ type: 'varchar', nullable: true })
  division?: string;

  @Column({ type: 'varchar', nullable: true })
  altColor?: string;

  @Column({ type: 'varchar', nullable: true })
  mascot?: string;

  @Column({ type: 'varchar', nullable: true })
  altName?: string;

  @OneToMany(() => DraftPick, (d) => d.team, { nullable: true })
  draftPicks: Promise<DraftPick[]>;

  @OneToMany(() => Game, (g) => g.homeTeam, { nullable: true })
  homeGames: Promise<Game[]>;

  @OneToMany(() => Game, (g) => g.awayTeam, { nullable: true })
  awayGames: Promise<Game[]>;

  @ManyToOne(() => Venue, (v) => v.teams)
  @JoinColumn()
  stadium: Promise<Venue>;

  @OneToMany(() => TeamRecord, (r) => r.team)
  records: Promise<TeamRecord[]>;

  @BeforeInsert()
  @BeforeUpdate()
  setESPNLogo() {
    this.logo = `https://a1.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/${this.espnId}.png`;
  }
}
