import { DateTime } from 'luxon';
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Game } from './game.entity';
import { League } from './league.entity';
import { TeamRecord } from './team-record.entity';

@Entity('seasons')
export class Season extends BaseEntity {
  @PrimaryColumn()
  year: number;

  @Column()
  weeks: number;

  @Column()
  currentWeek: number;

  @Column('timestamp')
  startsAt: string;

  @Column('timestamp')
  endsAt: string;

  @OneToMany(() => Game, (g) => g.season)
  games: Promise<Game[]>;

  @ManyToMany(() => League)
  @JoinTable()
  leagues: Promise<League[]>;

  @ManyToOne(() => TeamRecord, (t) => t.season)
  records: Promise<TeamRecord[]>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeUpdate()
  @BeforeInsert()
  setCurrentWeek() {
    const now = DateTime.now();
    const start = DateTime.fromISO(this.startsAt);
    const diff = now.diff(start, ['weeks']);

    console.log(diff.weeks);

    if (diff.weeks <= 0) {
      this.currentWeek = 0;
    } else {
      this.currentWeek = Math.ceil(diff.weeks);
    }
  }
}
