import { IsObject, IsPhoneNumber } from 'class-validator';
import { Name } from 'src/db/entities';

export class CreatePlayersDto {
  @IsObject()
  name: Name;

  @IsPhoneNumber()
  phoneNumber: string;
}
