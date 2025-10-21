import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { JwtGuard, AccessGuard } from 'src/helpers/guards';

import { AuthModule } from 'src/controllers/auth';
import { RoutesController } from './routes.controller';
import { MyModule } from './my';
import { SeasonsModule } from './seasons';

@Module({
  imports: [AuthModule, SeasonsModule, MyModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AccessGuard,
    },
  ],
  controllers: [RoutesController],
})
export class RoutesModule {}
