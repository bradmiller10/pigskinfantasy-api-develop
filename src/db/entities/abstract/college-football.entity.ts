import { Column } from 'typeorm';
import { NanoIdEntity } from './nanoid.entity';

export abstract class CollegeFootballEntity extends NanoIdEntity {
  @Column({ type: 'int', unique: true })
  espnId: number;
}
