import { DateTime } from 'luxon';
import { REFRESH_TOKEN_EXPIRE } from 'src/blueprint';
import { Column, Entity, OneToOne } from 'typeorm';
import { DefaultEntity } from './abstract/default.entity';

import { User } from './user.entity';

@Entity('refresh_tokens')
export class RefreshToken extends DefaultEntity {
  @OneToOne(() => User)
  user: User;

  @Column({
    type: 'bool',
    default: false,
  })
  isRevoked: boolean;

  @Column({
    type: 'timestamp',
    default: DateTime.now().plus({ milliseconds: REFRESH_TOKEN_EXPIRE }),
  })
  expiresAt: Date;
}
