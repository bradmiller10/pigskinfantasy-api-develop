/**
 * Represents a JSON response of a College Football Data Team
 *
 * @docs https://collegefootballdata.com/exporter/teams
 */
export interface CollegeFootballDataTeamDto {
  id: number;
  school: string;
  mascot: string;
  abbreviation: string;
  alt_name_1: string;
  alt_name_2: string;
  alt_name_3: string;
  conference: string;
  division: string;
  color: string;
  alt_color: string;
  logos: string[];
  location: {
    venue_id: number;
    name: string;
    city: string;
    state: string;
    zip: string;
    country_code: string;
    timezone: string;
    latitude: number;
    longitude: number;
    elevation: number;
    capacity: number;
    year_constructed: number;
    grass: boolean;
    dome: boolean;
  };
}
