import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';

import { User } from 'src/db/entities';
import { encrypt } from 'src/helpers/functions/crypto';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  listenTo() {
    return User;
  }

  private async hashOneTimeCode(event: InsertEvent<User> | UpdateEvent<User>) {
    // Hash Password
    if (event.entity.oneTimeCode) {
      event.entity.oneTimeCode = await encrypt(event.entity.oneTimeCode);
    }
  }

  async beforeInsert(event: InsertEvent<User>) {
    await this.hashOneTimeCode(event);

    // Set last seen
    event.entity.lastSeen = new Date();
  }

  async beforeUpdate(event: UpdateEvent<User>) {
    await this.hashOneTimeCode(event);
  }
}
