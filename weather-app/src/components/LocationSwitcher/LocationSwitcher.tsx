import clsx from 'clsx';
import { useAirport } from '../../hooks/useAirport';
import { Location } from '../../types';
import { PinIcon } from './PinIcon';
import styles from './LocationSwitcher.module.css';

/**
 * location switcher allowing the currently selected airport to be changed
 */
export const LocationSwitcher = (
  props: React.HTMLAttributes<HTMLDivElement>
) => {
  const { arrival, departure, location, setLocation } = useAirport();

  return (
    <div {...props} className={clsx(props.className, styles.container)}>
      <div
        className={styles.departure}
        onClick={() => setLocation?.(Location.Departure)}
      >
        <PinIcon
          className={clsx(styles.pin, {
            [styles.active]: location === Location.Departure
          })}
        />
        <div>{departure?.name}</div>
      </div>

      <div className={styles.flightPath}></div>

      <div
        className={styles.arrival}
        onClick={() => setLocation?.(Location.Arrival)}
      >
        <PinIcon
          className={clsx(styles.pin, {
            [styles.active]: location === Location.Arrival
          })}
        />
        <div>{arrival?.name}</div>
      </div>
    </div>
  );
};
