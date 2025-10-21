import { IsDate, IsEnum } from 'class-validator';
import { DraftStatus } from 'src/typings';

export class UpdateDraftDto {
  @IsEnum(DraftStatus)
  status?: DraftStatus;

  @IsDate()
  /**
   * The time in which the draft should begin
   */
  startsAt?: Date;

  @IsDate()
  /**
   * When the draft should end
   */
  endsAt?: Date;
}
