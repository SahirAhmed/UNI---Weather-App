import { useAirport } from '../../hooks/useAirport';
import { Location } from '../../types';
import { BasicWeather } from '../BasicWeather';
import { LinkButton } from '../Button';
import { DateTime } from '../DateTime';
import { LocationSwitcher } from '../LocationSwitcher';
import styles from './Overview.module.css';

/**
 * main overview page
 */
export const Overview = () => {
  const { airport, location } = useAirport();

  return (
    <>
      <LocationSwitcher className={styles.locationSwitcher} />
      <DateTime className={styles.dateTime} timeZone={airport?.timeZone} />
      <BasicWeather className={styles.weather} />

      <LinkButton to={`/${location}/weather`}>
        {location === Location.Departure && 'Departing Conditions'}
        {location === Location.Arrival && 'Arrival Forecast'}
      </LinkButton>
      <LinkButton to='/settings'>Settings</LinkButton>
    </>
  );
};
