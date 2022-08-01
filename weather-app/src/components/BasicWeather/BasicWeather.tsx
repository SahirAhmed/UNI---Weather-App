import clsx from 'clsx';
import { useUnits } from '../../hooks/useUnits';
import { useWeather } from '../../hooks/useWeather';
import { MeasurementSystem, Weather } from '../../types';
import styles from './BasicWeather.module.css';
import cloudIcon from './icons/cloud.png';
import fogIcon from './icons/fog.png';
import rainIcon from './icons/rain.png';
import snowIcon from './icons/snow.png';
import stormIcon from './icons/storm.png';
import sunIcon from './icons/sun.png';
import windIcon from './icons/wind.png';

/**
 * gets the most appropriate weather icon for a given weather condition code (group id).
 * based on https://openweathermap.org/weather-conditions#Weather-Condition-Codes-2
 */
const getWeatherIcon = (groupId: number) => {
  // thunderstorm
  if (groupId >= 200 && groupId < 300) {
    return stormIcon;
  }

  // drizzle and rain
  if (groupId >= 300 && groupId < 600) {
    return rainIcon;
  }

  // snow
  if (groupId >= 600 && groupId < 700) {
    return snowIcon;
  }

  // low visibility
  if (groupId >= 700 && groupId < 800) {
    return fogIcon;
  }

  // clear
  if (groupId === 800) {
    return sunIcon;
  }

  // cloudy
  if (groupId > 800 && groupId < 900) {
    return cloudIcon;
  }

  // default
  return windIcon;
};

export type BasicWeatherProps = React.HTMLAttributes<HTMLDivElement> & {
  weather?: Weather;
};

/**
 * displays the weather and temperature for a given weather
 */
export const BasicWeather = ({
  weather: inputWeather,
  ...props
}: BasicWeatherProps) => {
  const [units] = useUnits();
  const { current, name } = useWeather();

  // if weather data was not given, use the current weather by default
  const weather = inputWeather ?? current;

  return (
    <div {...props} className={clsx(props.className, styles.container)}>
      {weather && (
        <>
          <div className={styles.weather}>
            <img
              className={styles.icon}
              src={getWeatherIcon(weather.weather.groupId)}
              alt={weather.weather.description}
              title={weather.weather.name}
            />
            <span className={styles.divider} />
            <span className={styles.temperature}>
              {weather.temperature.toFixed(1)}°
              {units === MeasurementSystem.Imperial ? 'F' : 'C'}
            </span>
          </div>
          <div className={styles.location}>{name}</div>
        </>
      )}
    </div>
  );
};
