import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { entities } from 'src/db';
import { EntityManager, EntityTarget } from 'typeorm';
import { RepositoryService } from './repository.service';

@Global()
@Module({})
export class RepositoryModule {
  static forRoot(): DynamicModule {
    const providers: Provider[] = entities.map((entity) => ({
      provide: entity.name,
      inject: [getEntityManagerToken()],
      useFactory: (entityManger: EntityManager): RepositoryService<typeof entity> =>
        new RepositoryService(entity as EntityTarget<typeof entity>, entityManger),
    }));

    // providers.push(RepositoryService);

    return {
      module: RepositoryModule,
      providers,
      exports: providers,
    };
  }
}
