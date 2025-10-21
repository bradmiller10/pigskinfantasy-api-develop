export type CollegeFootballDataRecordDto = {
  year: number;
  team: string;
  conference: string;
  division: string;
  total: {
    games: number;
    wins: number;
    losses: number;
    ties: number;
  };
  conferenceGames: {
    games: number;
    wins: number;
    losses: number;
    ties: number;
  };
  homeGames: {
    games: number;
    wins: number;
    losses: number;
    ties: number;
  };
  awayGames: {
    games: number;
    wins: number;
    losses: number;
    ties: number;
  };
};
