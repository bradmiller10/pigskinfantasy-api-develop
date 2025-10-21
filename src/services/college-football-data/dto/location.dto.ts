export interface CollegeFootballDataLocationDto {
  id: number;
  name: string;
  capacity: number;
  grass: boolean;
  city: string;
  state: string;
  zip: string;
  country_code: string;
  location: {
    x: number;
    y: number;
  };
  elevation: number;
  year: number;
  dome: boolean;
  timezone: string;
}
