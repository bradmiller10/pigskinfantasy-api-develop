import { Module, CacheModule as CM } from '@nestjs/common';
import { CacheService } from './cache.service';

@Module({
  imports: [CM.register()],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
