import { BeforeInsert, Column } from 'typeorm';
import { nanoid } from 'nanoid';
import { DefaultEntity } from './default.entity';

export abstract class NanoIdEntity extends DefaultEntity {
  @Column({
    type: 'varchar',
    length: 21,
  })
  nanoid: string;

  @BeforeInsert()
  setNanoId() {
    this.nanoid = nanoid();
  }
}
