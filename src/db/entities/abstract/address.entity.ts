import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column } from 'typeorm';

import { Country, State } from 'src/typings';

export abstract class Address {
  @Column({
    type: 'varchar',
    nullable: true,
  })
  @ApiPropertyOptional()
  line1?: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  @ApiPropertyOptional()
  line2?: string;

  @Column({
    type: 'enum',
    enum: State,
  })
  @ApiProperty({
    enum: State,
    default: State.Texas,
  })
  state: State;

  @Column()
  @ApiProperty({
    default: 'Fort Worth',
  })
  city: string;

  @Column({
    type: 'enum',
    enum: Country,
    default: Country.UnitedStates,
  })
  @ApiProperty({
    enum: Country,
    default: Country.UnitedStates,
  })
  country?: Country;

  @Column({ type: 'int', width: 16 })
  @ApiProperty({
    default: 76177,
  })
  zipcode: number;
}
