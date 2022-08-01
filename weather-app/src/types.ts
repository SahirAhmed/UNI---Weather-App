export type Airport = {
  id: string; // ICAO airport code
  city: string;
  coordinates: [number, number]; // latitude, longitude
  currency: string;
  name: string;
  timeZone: string;
};

export enum Location {
  Arrival = 'arrival',
  Departure = 'departure'
}

export enum MeasurementSystem {
  Imperial = 'imperial',
  Metric = 'metric'
}

// derived from the OpenWeather API response format
// https://openweathermap.org/current#current_JSON
// https://openweathermap.org/api/one-call-api#hist_parameter
export type Weather = {
  clouds: number;
  humidity: number;
  precipitation?: number;
  pressure: number;
  temperature: number;
  type?: 'current' | 'daily' | 'hourly';
  typeIndex?: number;
  visibility?: number;
  weather: {
    description: string;
    groupId: number;
    name: string;
  };
  windSpeed: number;
};

export type WeatherInfo = {
  current?: Weather;
  forecast?: Weather[];
  name?: string;
};
