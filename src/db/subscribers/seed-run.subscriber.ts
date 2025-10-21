import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';

import { SeedRun } from 'src/db/entities';
import { SeedRunState } from 'src/typings';

@EventSubscriber()
export class SeedRunSubscriber implements EntitySubscriberInterface<SeedRun> {
  listenTo() {
    return SeedRun;
  }

  async beforeInsert(event: InsertEvent<SeedRun>) {
    this.setCompletedDate(event.entity);
  }

  // async beforeUpdate(event: UpdateEvent<SeedRun>) {
  //   this.setCompletedDate(event.entity);
  // }

  private setCompletedDate(entity: SeedRun): SeedRun {
    if (entity.state === SeedRunState.Completed) {
      entity.completedAt = new Date();
    }

    return entity;
  }
}
