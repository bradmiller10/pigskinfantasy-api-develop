import { BeforeUpdate, Column } from 'typeorm';

export abstract class Score {
  @Column({ type: 'int', default: 0 })
  totalScore: number;

  @Column({ type: 'int', nullable: true })
  firstQuarterScore?: number;

  @Column({ type: 'int', nullable: true })
  secondQuarterScore?: number;

  @Column({ type: 'int', nullable: true })
  thirdQuarterScore?: number;

  @Column({ type: 'int', nullable: true })
  fourthQuarterScore?: number;
}
