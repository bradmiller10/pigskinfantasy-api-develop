import { Injectable } from '@nestjs/common';
import { User } from 'src/db/entities';
import { DefaultRepository } from 'src/helpers/classes';

@Injectable()
export class UsersService extends DefaultRepository<User> {}
