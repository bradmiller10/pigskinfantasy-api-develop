import { PartialType } from '@nestjs/swagger';
import { User } from 'src/db/entities';

export class UpdateUserDto extends PartialType(User) {}
