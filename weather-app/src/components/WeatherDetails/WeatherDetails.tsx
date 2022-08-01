import clsx from 'clsx';
import dayjs from 'dayjs';
import {
  Redirect,
  Route,
  Switch,
  useParams,
  useRouteMatch
} from 'react-router';
import { Link } from 'react-router-dom';
import { useAirport } from '../../hooks/useAirport';
import { useWeather } from '../../hooks/useWeather';
import { WeatherInfo } from '../../types';
import { BasicWeather } from '../BasicWeather';
import { DateTime } from '../DateTime';
import { StatBar, WeatherStatistic } from './StatBar';
import styles from './WeatherDetails.module.css';

/**
 * rendered by main `WeatherDetails` component. this is a separate component as we need
 * react router context to be present in order for the `useParam` hook to be effective
 */
const InnerWeatherDetails = () => {
  // key will either be current or forecast and forecastIndex
  // will only be defined if we're rendering forecast details
  const params = useParams<{
    forecastIndex?: string;
    key: keyof Omit<WeatherInfo, 'name'>;
  }>();
  const weatherInfo = useWeather();

  // index of the weather forecast array
  const forecastIndex = Number(params.forecastIndex ?? -1);

  // used to hide the next button after going through all the forecasts
  let isLastIndex;

  // either an array of weathers (forecast) or current weather
  let weather = weatherInfo[params.key];

  // is it a forecast?
  if (Array.isArray(weather)) {
    isLastIndex = !weather[forecastIndex + 1];
    weather = weather[forecastIndex];
  }

  if (!weather) {
    return null;
  }

  return (
    <>
      <BasicWeather className={styles.weather} weather={weather} />

      <Route path='/arrival/weather/current'>
        <div className={styles.pagination}>
          <span style={{ visibility: 'hidden' }} />
          <span>Now</span>

          <Link
            className={styles.next}
            to={`/arrival/weather/forecast/${forecastIndex + 1}`}
          />
        </div>
      </Route>

      <Route path='/arrival/weather/forecast/:forecastIndex'>
        <div className={styles.pagination}>
          <Link
            className={clsx(styles.previous)}
            to={
              forecastIndex <= 0
                ? '/arrival/weather/current'
                : `/arrival/weather/forecast/${forecastIndex - 1}`
            }
          />

          <span>
            {weather.type === 'daily' &&
              dayjs()
                .add((weather.typeIndex ?? forecastIndex) + 1, 'day')
                .format('dddd Do MMMM')}
            {weather.type === 'hourly' &&
              dayjs()
                .add((weather.typeIndex ?? forecastIndex) + 1, 'hour')
                .format('ha')}
          </span>

          <Link
            className={clsx(styles.next, { [styles.hidden]: isLastIndex })}
            to={`/arrival/weather/forecast/${forecastIndex + 1}`}
          />
        </div>
      </Route>

      <StatBar type={WeatherStatistic.Precipitation} weather={weather} />
      <StatBar type={WeatherStatistic.Visibility} weather={weather} />
      <StatBar type={WeatherStatistic.Humidity} weather={weather} />
      <StatBar type={WeatherStatistic.Pressure} weather={weather} />
      <StatBar type={WeatherStatistic.WindSpeed} weather={weather} />
      <StatBar type={WeatherStatistic.CloudCover} weather={weather} />
    </>
  );
};

/**
 * weather details page with routing for arrival/departure specific functionality.
 * departure and arrival will both show the current weather but arrival can also
 * show weather forecasts using the arrows for pagination.
 */
export const WeatherDetails = () => {
  const { airport } = useAirport();
  const { url } = useRouteMatch();

  return (
    <>
      <DateTime
        className={styles.dateTime}
        compact
        timeZone={airport?.timeZone}
      />
      <Switch>
        <Route path={`${url}/:key/:forecastIndex?`} exact>
          <InnerWeatherDetails />
        </Route>
        <Redirect to={`${url}/current`} />
      </Switch>
    </>
  );
};
