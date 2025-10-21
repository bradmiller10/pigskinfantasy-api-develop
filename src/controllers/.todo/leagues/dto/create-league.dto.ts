import { IsNumber, IsString } from 'class-validator';

export class CreateLeagueDto {
  @IsString()
  name: string;
  @IsNumber()
  ownerId: number;
}
