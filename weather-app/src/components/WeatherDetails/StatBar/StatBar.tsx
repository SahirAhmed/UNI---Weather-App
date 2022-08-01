import { useUnits } from '../../../hooks/useUnits';
import { MeasurementSystem, Weather } from '../../../types';
import styles from './StatBar.module.css';

export enum WeatherStatistic {
  Precipitation = 'Precipitation',
  Visibility = 'Visibility',
  Humidity = 'Humidity',
  Pressure = 'Atmospheric Pressure',
  WindSpeed = 'Wind Speed',
  CloudCover = 'Cloud Cover'
}

/**
 * gets the formatted value of a weather statistic in the correct units.
 * will return undefined if the value for the statistic does not exist in the weather data.
 *
 * @param type statistic to be formatted
 * @param weather weather data from the api
 * @param units what measurement system the weather data is currently in
 */
const getValue = (
  type: WeatherStatistic,
  weather: Weather,
  units?: MeasurementSystem
) => {
  switch (type) {
    case WeatherStatistic.Precipitation:
      // only rainy or snowy weather conditions will have a precipitation value
      return weather.precipitation ? `${weather.precipitation} mm` : undefined;

    case WeatherStatistic.Visibility:
      // daily forecasts do not have visibility data
      if (!weather.visibility) {
        return undefined;
      }

      return units === MeasurementSystem.Imperial
        ? `${weather.visibility / 1000 / 1.6} mi`
        : `${weather.visibility / 1000} km`;

    case WeatherStatistic.Humidity:
      return `${weather.humidity}%`;

    case WeatherStatistic.Pressure:
      return `${weather.pressure} hPa`;

    case WeatherStatistic.WindSpeed:
      return `${weather.windSpeed} ${
        units === MeasurementSystem.Imperial ? 'mph' : 'm/s'
      }`;

    case WeatherStatistic.CloudCover:
      return `${weather.clouds}%`;
  }
};

export type StatBarProps = {
  type: WeatherStatistic;
  weather: Weather;
};

/**
 * renders a single statistic bar for the `WeatherDetails` component.
 * will render nothing if there is no data for the given statistic.
 */
export const StatBar = ({ type, weather }: StatBarProps) => {
  const [units] = useUnits();
  const value = getValue(type, weather, units);

  if (value) {
    return (
      <div className={styles.bar}>
        <span className={styles.type}>{type}</span>
        <span className={styles.value}>{value}</span>
      </div>
    );
  }

  return null;
};
