import * as faker from 'faker';

import { Seeds } from './seeds';
import { State, UserRole, UserStatus } from 'src/typings';
import { User } from 'src/db/entities';

export class UserSeeds extends Seeds<User> {
  /**
   * If no amount is set or passed we will generate 5 users
   *
   * @author jordanskomer
   * @since 0.0.1
   */
  amount = 5;

  /**
   * Generates a random user object
   *
   * @returns {User}
   * @author jordanskomer
   * @since 0.0.1
   */
  async generate() {
    const user = new User();
    user.name = {
      first: faker.name.firstName(),
      last: faker.name.lastName(),
      middle: faker.datatype.boolean() ? faker.name.middleName() : null,
    };
    console.log(this.randomEnumValue<State>(State));
    user.phoneNumber = this.randomPhoneNumber();
    user.role = this.randomEnumValue<UserRole>(UserRole);
    user.status = this.randomEnumValue<UserStatus>(UserStatus);
    user.signinCount = faker.datatype.number(5);

    return user;
  }
}
