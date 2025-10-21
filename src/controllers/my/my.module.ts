import { Module } from '@nestjs/common';
import { MyController } from './my.controller';

@Module({
  controllers: [MyController],
  providers: [],
})
export class MyModule {}
