import { IsDate, IsEnum } from 'class-validator';
import { DraftType } from 'src/typings';

export class CreateDraftDto {
  @IsEnum(DraftType)
  /**
   * The type of draft to choose
   */
  type: DraftType;

  @IsDate()
  /**
   * The time in which the draft should begin
   */
  startsAt: Date;

  @IsDate()
  /**
   * When the draft should end
   */
  endsAt: Date;
}
