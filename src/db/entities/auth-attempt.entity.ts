import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { DefaultEntity } from './abstract/default.entity';
import { User } from './user.entity';

@Entity('auth_attempts')
export class AuthAttempt extends DefaultEntity {
  @Column()
  requestId: string;

  @Column()
  ip: string;

  @Column({
    type: 'enum',
    enum: AuthAttempt,
  })
  type: AuthAttempt;

  @ManyToOne(() => User, (u) => u.authAttempts)
  @JoinColumn()
  user: User;
}
