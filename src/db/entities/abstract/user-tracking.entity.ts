import { JoinColumn, OneToOne } from 'typeorm';

import { User } from '../user.entity';
import { NanoIdEntity } from './nanoid.entity';

export abstract class UserTracking extends NanoIdEntity {
  @OneToOne(() => User)
  @JoinColumn()
  createdBy: User;
  @OneToOne(() => User)
  @JoinColumn()
  updatedBy: User;
}
