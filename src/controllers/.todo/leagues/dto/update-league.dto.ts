import { PartialType } from '@nestjs/swagger';
import { League } from 'src/db/entities';

export class UpdateLeagueDto extends PartialType(League) {}
