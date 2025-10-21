import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CollegeFootballDataGameDto } from '../college-football-data';
import { Logger } from '../logger/logger.service';
import { CacheKey } from './enums';

@Injectable()
export class CacheService {
  private logger = new Logger(CacheService.name);
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getGames(): Promise<CollegeFootballDataGameDto[]> {
    const games = await this.cacheManager.get<CollegeFootballDataGameDto[]>(CacheKey.CollegeFootballDataGames);
    this.logger.verbose(`Loaded ${games} from cache`);
    return games;
  }

  async setGames(games: CollegeFootballDataGameDto[], expiresInMinutes = 15) {
    await this.cacheManager.set(CacheKey.CollegeFootballDataGames, games, { ttl: expiresInMinutes * 60 * 1000 });
  }
}
