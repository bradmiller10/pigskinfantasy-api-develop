import { Matches, MaxLength, MinLength } from 'class-validator';

export class VerifyDto {
  @MaxLength(6)
  @MinLength(6)
  @Matches(/\d{6}/)
  code: string;
}
