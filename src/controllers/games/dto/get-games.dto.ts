import { Score, Team, Venue } from 'src/db/entities';

export type GetGamesDto = {
  startsAt: Date;
  home: Score;
  away: Score;

  homeTeam: Team;
  awayTeam: Team;

  venue: Venue;
};
