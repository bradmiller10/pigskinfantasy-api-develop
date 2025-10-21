import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { DefaultEntity } from './abstract/default.entity';

import { SeedRun } from './seed-run.entity';

@Entity('seed_run_item')
export class SeedRunItem extends DefaultEntity {
  @Column()
  entityName: string;

  @Column()
  entityId: string;

  @ManyToOne(() => SeedRun, (s) => s.items)
  @JoinColumn()
  parent: SeedRun;
}
