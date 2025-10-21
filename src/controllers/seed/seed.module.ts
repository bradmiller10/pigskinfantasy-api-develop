import { DynamicModule, Module } from '@nestjs/common';

import { SeedingModule } from 'src/services/seeding/seeding.module';

import { SeedController } from './seed.controller';

@Module({})
export class SeedModule {
  static register(): DynamicModule {
    // if (process.env.ENV === 'production') {
    //   return null;
    // }

    return {
      imports: [SeedingModule],
      module: SeedModule,
      controllers: [SeedController],
    };
  }
}
