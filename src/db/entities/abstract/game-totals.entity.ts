import { Column } from 'typeorm';

export abstract class GameTotals {
  @Column({ type: 'int', default: 0 })
  games: number;

  @Column({ type: 'int', nullable: true })
  wins?: number;

  @Column({ type: 'int', nullable: true })
  losses?: number;

  @Column({ type: 'int', nullable: true })
  ties?: number;
}
