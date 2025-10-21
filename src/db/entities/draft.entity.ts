import { DraftStatus, DraftType } from 'src/typings';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { NanoIdEntity } from './abstract';
import { DraftPick } from './draft-pick.entity';
import { League } from './league.entity';

@Entity('drafts')
export class Draft extends NanoIdEntity {
  @Column({
    type: 'enum',
    enum: DraftType,
    default: DraftType.SnakeCase,
  })
  type: DraftType;

  @Column({
    type: 'enum',
    enum: DraftStatus,
    default: DraftStatus.Created,
  })
  status: DraftStatus;

  @Column('timestamp')
  startsAt: Date;

  @OneToOne(() => League)
  league: Promise<League>;

  @OneToMany(() => DraftPick, (d) => d.draft, { nullable: true, eager: true })
  draftPicks?: DraftPick[];
}
