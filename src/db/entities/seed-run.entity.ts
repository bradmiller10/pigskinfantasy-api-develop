import { Entity, Column, OneToMany } from 'typeorm';

import { SeedRunState } from 'src/typings';
import { SeedRunItem } from './seed-run-item.entity';
import { DefaultEntity } from './abstract/default.entity';

@Entity('seed_run')
export class SeedRun extends DefaultEntity {
  @Column({ nullable: true, type: 'timestamp' })
  completedAt: Date;

  @Column({ type: 'enum', enum: SeedRunState, default: SeedRunState.Waiting })
  state: SeedRunState;

  @OneToMany(() => SeedRunItem, (s) => s.parent, { nullable: true, eager: true })
  items: SeedRunItem[];
}
