import clsx from 'clsx';
import { useState } from 'react';
import { useAirport } from '../../hooks/useAirport';
import { useUnits } from '../../hooks/useUnits';
import { MeasurementSystem } from '../../types';
import { Button, LinkButton } from '../Button';
import { CurrencyConverter } from '../CurrencyConverter';
import styles from './Settings.module.css';

/**
 * settings page
 */
export const Settings = () => {
  const { departure, arrival } = useAirport();
  const [units, setUnits] = useUnits();

  // used for the CurrencyConverter component
  const [[from, to], setCurrencyOrder] = useState([
    departure?.currency,
    arrival?.currency
  ]);

  return (
    <>
      <div>
        <h1 className={styles.title}>Set New Departure Location</h1>
        <LinkButton small to='/select/departure?automatic=true'>
          Automatic
        </LinkButton>
        <LinkButton small to='/select/departure'>
          Manual
        </LinkButton>
      </div>
      <div>
        <h1 className={styles.title}>Set New Arrival Location</h1>
        <LinkButton to='/select/arrival'>Choose Location</LinkButton>
      </div>
      <div>
        <h1 className={styles.title}>Temperature Units</h1>
        <Button
          className={clsx(styles.units, {
            [styles.active]: units === MeasurementSystem.Metric
          })}
          onClick={() => setUnits(MeasurementSystem.Metric)}
          small
        >
          Celcius
        </Button>
        <Button
          className={clsx(styles.units, {
            [styles.active]: units === MeasurementSystem.Imperial
          })}
          onClick={() => setUnits(MeasurementSystem.Imperial)}
          small
        >
          Fahrenheit
        </Button>
      </div>
      {from && to && (
        <div>
          <h1 className={styles.title}>Currency Converter</h1>
          <CurrencyConverter
            from={from}
            to={to}
            onSwapClick={(...order) => setCurrencyOrder(order)}
          />
        </div>
      )}
    </>
  );
};
