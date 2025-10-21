import { IsUsername } from 'src/helpers/decorators';

export class LoginDto {
  @IsUsername()
  phoneNumber?: string = '0000000000';

  /**
   * Used by Biometric login for authentication
   */
  signature?: string = '';
}
