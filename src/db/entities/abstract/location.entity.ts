import { Column } from 'typeorm';

import { Country, State } from 'src/typings';

export abstract class Location {
  @Column({
    type: 'varchar',
    nullable: true,
  })
  name?: string;

  @Column({
    type: 'enum',
    enum: State,
  })
  state: State;

  @Column()
  city: string;

  @Column({
    type: 'enum',
    enum: Country,
    default: Country.UnitedStates,
  })
  country?: Country;

  @Column({
    type: 'float',
    nullable: true,
  })
  latitude?: number;

  @Column({
    type: 'float',
    nullable: true,
  })
  longtitude?: number;

  @Column({ type: 'int', width: 16 })
  zipcode: number;
}
