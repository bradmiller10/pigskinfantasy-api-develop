import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column } from 'typeorm';

import { NamePrefix, NameSuffix } from 'src/typings';

export class Name {
  @Column()
  @ApiProperty({ default: 'John ' })
  first: string;

  @Column()
  @ApiProperty({ default: 'Snow' })
  last: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  @ApiPropertyOptional()
  middle?: string;

  @Column({ type: 'enum', enum: NamePrefix, nullable: true })
  @ApiPropertyOptional({
    enum: NamePrefix,
  })
  prefix?: NamePrefix;

  @Column({ type: 'enum', enum: NameSuffix, nullable: true })
  @ApiPropertyOptional({
    enum: NameSuffix,
  })
  suffix?: NameSuffix;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  @ApiPropertyOptional()
  preferred?: string;
}
