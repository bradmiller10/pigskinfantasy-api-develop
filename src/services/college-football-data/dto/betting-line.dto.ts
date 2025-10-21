interface Line {
  provider: string;
  spread: number;
  formattedSpread: string;
  spreadOpen: number;
  overUnder: number;
  overUnderOpen: number;
  homeMoneyline: number;
  awayMoneyline: number;
}

export interface CollegeFootballDataBettingLineDto {
  id: number;
  season: number;
  week: number;
  seasonType: string;
  homeTeam: string;
  homeConference: string;
  homeScore: number;
  awayTeam: string;
  awayConference: string;
  awayScore: number;
  lines: Line[];
}
