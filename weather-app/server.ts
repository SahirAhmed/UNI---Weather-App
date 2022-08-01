import fastify from 'fastify';
import fs from 'fs';
import got from 'got';
import { Airport, MeasurementSystem, Weather } from './src/types';

// tailwind api

// all env vars are prefixed with TAILWIND_API_ to prevent
// naming conflicts. default values are specified here
const {
  TAILWIND_API_AIRPORTS_PATH = 'airports.json',
  TAILWIND_API_DEFAULT_RESULTS_LIMIT = '50',
  TAILWIND_API_OPENEXCHANGERATES_API_KEY,
  TAILWIND_API_OPENEXCHANGERATES_API_URL = 'https://openexchangerates.org/api',
  TAILWIND_API_OPENWEATHER_API_KEY,
  TAILWIND_API_OPENWEATHER_API_URL = 'https://api.openweathermap.org/data/2.5',
  TAILWIND_API_PORT = '4000'
} = process.env;

const server = fastify({
  logger: { prettyPrint: process.env.NODE_ENV !== 'production' }
});

// application loses critical functionality without this key, exit if the key is not set
if (!TAILWIND_API_OPENWEATHER_API_KEY) {
  server.log.fatal(
    'Required environment variable TAILWIND_API_OPENWEATHER_API_KEY was not set'
  );
  process.exit(1);
}

// application does not lose critical functionality without this key, only warn if the key is not set
if (!TAILWIND_API_OPENEXCHANGERATES_API_KEY) {
  server.log.warn(
    'Environment variable TAILWIND_API_OPENEXCHANGERATES_API_KEY was not set, all fx endpoints will be disabled'
  );
}

// load and cache airports dataset in memory
const airports: Airport[] = JSON.parse(
  fs.readFileSync(TAILWIND_API_AIRPORTS_PATH, 'utf8')
);

// cache exchange rates to reduce number of requests to open exchange rates
// TODO: invalidate this cache once in a while to keep fx conversions up to date
let exchangeRates: { [currency: string]: number };

/**
 * calculates the distance between two coordinates on a sphere.
 * https://en.wikipedia.org/wiki/Haversine_formula
 *
 * @param coordinates1 first set of coordinates
 * @param coordinates2 second set of coordinates
 * @param radius radius of the sphere (default is Earth in kilometers)
 * @returns distance between the two coordinates
 */
const haversineDistance = (
  coordinates1: [number, number],
  coordinates2: [number, number],
  radius = 6371
) => {
  // degrees to radians
  const toRadians = (value: number) => (value * Math.PI) / 180;

  const [latitude1, longitude1] = coordinates1.map(toRadians);
  const [latitude2, longitude2] = coordinates2.map(toRadians);

  const diffLatitude = latitude2 - latitude1;
  const diffLongitude = longitude2 - longitude1;

  const hav =
    Math.sin(diffLatitude / 2) * Math.sin(diffLatitude / 2) +
    Math.cos(latitude1) *
      Math.cos(latitude2) *
      Math.sin(diffLongitude / 2) *
      Math.sin(diffLongitude / 2);

  return 2 * radius * Math.atan2(Math.sqrt(hav), Math.sqrt(1 - hav));
};

/**
 * maps data from openweather `onecall` endpoint to a simpler format for app to consume
 * @param openWeatherData current/hourly/daily data from openweather
 */
const mapOpenWeatherData = (openWeatherData: any): Weather => ({
  clouds: openWeatherData.clouds,
  humidity: openWeatherData.humidity,
  precipitation: openWeatherData.rain?.['1h'] ?? openWeatherData.snow?.['1h'],
  pressure: openWeatherData.pressure,
  temperature: openWeatherData.temp,
  visibility: openWeatherData.visibility,
  weather: {
    description: openWeatherData.weather[0].description,
    groupId: openWeatherData.weather[0].id,
    name: openWeatherData.weather[0].main
  },
  windSpeed: openWeatherData.wind_speed
});

// gets airports based on search and geolocation
server.get<{
  Querystring: {
    latitude?: string;
    longitude?: string;
    limit?: string;
    offset?: string;
    search?: string;
  };
}>('/api/airports', async request => {
  let results = airports;

  if (request.query.search) {
    const search = request.query.search.toLowerCase();

    // TODO: add full text search instead
    results = results.filter(
      airport =>
        airport.city.toLowerCase().includes(search) ||
        airport.id.toLowerCase().includes(search) ||
        airport.name.toLowerCase().includes(search)
    );
  }

  if (request.query.latitude && request.query.longitude) {
    const coordinates: [number, number] = [
      Number(request.query.latitude),
      Number(request.query.longitude)
    ];

    results = results.sort(
      (a, b) =>
        haversineDistance(a.coordinates, coordinates) -
        haversineDistance(b.coordinates, coordinates)
    );
  }

  // slice results to avoid sending too much data at once
  return results.slice(
    Number(request.query.offset ?? 0),
    Number(request.query.limit ?? TAILWIND_API_DEFAULT_RESULTS_LIMIT)
  );
});

// get weather conditions from openweather for a given airport id (ICAO code)
server.get<{
  Params: { airportId: string };
  Querystring: { units?: MeasurementSystem };
}>('/api/airport/:airportId/weather', async request => {
  const airport = airports.find(({ id }) => id === request.params.airportId);

  if (!airport) {
    throw new Error('Invalid airport id');
  }

  const { current, daily, hourly } = await got
    .get(`${TAILWIND_API_OPENWEATHER_API_URL}/onecall`, {
      searchParams: {
        appid: TAILWIND_API_OPENWEATHER_API_KEY,
        lat: airport.coordinates[0],
        lon: airport.coordinates[1],
        units: request.query.units ?? MeasurementSystem.Metric
      }
    })
    .json<{ current: any; daily: any; hourly: any }>();

  return {
    current: mapOpenWeatherData(current),
    // forecast will show the next 3 hours and the next 7 days
    forecast: [
      ...hourly
        .map((forecast: any, i: number) => ({
          ...mapOpenWeatherData(forecast),
          type: 'hourly',
          typeIndex: i
        }))
        .slice(0, 3),
      ...daily
        .map((forecast: any, i: number) => ({
          ...mapOpenWeatherData(forecast),
          // daily has a slightly different data structure than current and hourly
          precipitation: forecast.rain ?? forecast.snow,
          temperature: forecast.temp.day,
          type: 'daily',
          typeIndex: i
        }))
        .slice(0, 7)
    ]
  };
});

if (TAILWIND_API_OPENEXCHANGERATES_API_KEY) {
  // get foreign exchange rates from open exchange rates
  server.get('/api/fx/rates', async () => {
    // lazy load exchange rate data
    if (!exchangeRates) {
      const { rates } = await got
        .get(`${TAILWIND_API_OPENEXCHANGERATES_API_URL}/latest.json`, {
          searchParams: {
            app_id: TAILWIND_API_OPENEXCHANGERATES_API_KEY
          }
        })
        .json();
      exchangeRates = rates;
    }

    return exchangeRates;
  });
}

// listen on the given port on all network interfaces
server.listen(TAILWIND_API_PORT, '0.0.0.0');
