import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';

import { UserAuthStatus, UserRole, UserStatus } from 'src/typings';

import { Name } from './abstract';
import { RefreshToken } from './refresh-token.entity';
import { AuthAttempt } from './auth-attempt.entity';
import { League } from './league.entity';
import { NanoIdEntity } from './abstract/nanoid.entity';
import { DraftPick } from './draft-pick.entity';

@Entity('users')
export class User extends NanoIdEntity {
  @Column(() => Name)
  name: Name;

  @Column({ type: 'varchar', unique: true, length: 16 })
  phoneNumber: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.User,
  })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.Active,
  })
  status: UserStatus;

  @Column({
    type: 'enum',
    enum: UserAuthStatus,
    default: UserAuthStatus.LoggedOut,
  })
  authStatus: UserAuthStatus;

  @Column({ type: 'timestamp', nullable: true })
  lastSeen: Date;

  @Column({ type: 'int', default: 0 })
  signinCount: number;

  @Column({ type: 'varchar', nullable: true })
  oneTimeCode: string;

  @OneToOne(() => RefreshToken, { eager: true })
  @JoinColumn()
  refreshToken?: RefreshToken;

  @OneToMany(() => AuthAttempt, (a) => a.user)
  authAttempts: Promise<AuthAttempt[]>;

  @OneToMany(() => League, (l) => l.owner)
  leagues: Promise<League[]>;

  @OneToMany(() => DraftPick, (d) => d.user, { eager: true })
  draftPicks: DraftPick[];

  @ManyToOne(() => League, (l) => l.players, { eager: true })
  @JoinColumn()
  activeLeague?: League;
}
