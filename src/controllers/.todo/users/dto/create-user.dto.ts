import { UserRole } from 'src/typings/enums';
import { IsNotEmpty, IsPhoneNumber } from 'class-validator';

import { Name } from 'src/db/entities/abstract';

export class CreateUserDto {
  @IsPhoneNumber()
  @IsNotEmpty()
  /**
   * A phone number in E.164 format
   */
  phoneNumber: string;

  name: Name;

  role?: UserRole;
}
