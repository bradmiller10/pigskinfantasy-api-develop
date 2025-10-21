import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { NanoIdEntity } from './abstract';
import { Draft } from './draft.entity';
import { User } from './user.entity';

@Entity('leagues')
export class League extends NanoIdEntity {
  @Column()
  name: string;

  @ManyToOne(() => User, (u) => u.leagues)
  @JoinColumn()
  owner: Promise<User>;

  @OneToMany(() => User, (u) => u.activeLeague)
  players: Promise<User[]>;

  @OneToOne(() => Draft, { nullable: true, eager: true })
  @JoinColumn()
  activeDraft?: Draft;

  @OneToMany(() => Draft, (d) => d.league)
  drafts: Promise<Draft[]>;
}
