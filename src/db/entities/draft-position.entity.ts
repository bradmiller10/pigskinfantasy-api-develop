import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { DefaultEntity } from './abstract/default.entity';
import { Draft } from './draft.entity';
import { User } from './user.entity';

@Entity('draft_positions')
export class DraftPosition extends DefaultEntity {
  @Column()
  position: number;

  @OneToOne(() => Draft)
  @JoinColumn()
  draft: Draft;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
