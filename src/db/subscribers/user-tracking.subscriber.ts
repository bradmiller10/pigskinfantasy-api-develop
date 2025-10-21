import { Inject } from '@nestjs/common';
import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';

import { UserTracking } from '../entities/abstract/user-tracking.entity';

@EventSubscriber()
export class UserTrackingSubscriber implements EntitySubscriberInterface<UserTracking> {
  constructor(@Inject('CurrentContext') private context) {}

  listenTo() {
    return UserTracking;
  }

  async beforeInsert(event: InsertEvent<UserTracking>) {
    console.log(this.context);
  }

  async beforeUpdate(event: UpdateEvent<UserTracking>) {
    // Hash oneTimeCode
    console.log('Set user tracking');
  }
}
