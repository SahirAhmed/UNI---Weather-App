import clsx from 'clsx';
import { useEffect, useState } from 'react';
import styles from './CurrencyConverter.module.css';

export type CurrencyConverterProps = React.HTMLAttributes<HTMLDivElement> & {
  /**
   * currency to convert from
   */
  from: string;
  /**
   * currency to convert to
   */
  to: string;
  /**
   * @param from new currency to convert from
   * @param to new currency to convert to
   */
  onSwapClick?: (from: string, to: string) => void;
};

/**
 * allows currency to converted from one to another. rates are fetched from the `/api/fx/rates` endpoint
 */
export const CurrencyConverter = ({
  from,
  to,
  onSwapClick,
  ...props
}: CurrencyConverterProps) => {
  const [amount, setAmount] = useState('0.00');
  const [rates, setRates] = useState<{
    [currency: string]: number;
  }>();

  // used to determine whether to display a fallback or not
  const [error, setError] = useState<Error>();

  useEffect(() => {
    // this request usually fails if the exchange rates api key is not set
    fetch('/api/fx/rates')
      .then(res => {
        // check for a 200 status as the error responses will also be a json format
        if (res.ok) {
          return res.json();
        }

        throw res;
      })
      .then(setRates)
      .catch(setError);
  }, []);

  if (error) {
    return (
      <div>
        Currency converter is unavailable at the moment. Please try again later.
      </div>
    );
  }

  return (
    <div {...props} className={clsx(props.className, styles.container)}>
      <input
        className={styles.amount}
        type='number'
        step='0.01'
        value={amount}
        onChange={e => setAmount(e.target.value)}
      />
      <span className={styles.value}>{from}</span>
      <button
        className={styles.swapButton}
        onClick={() => onSwapClick?.(to, from)}
      >
        <svg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'>
          <path d='M92.69 216c6.23 6.24 16.39 6.24 22.62 0L136 195.31c6.24-6.23 6.24-16.39 0-22.62L115.31 152H400c26.47 0 48 21.53 48 48 0 13.23 10.77 24 24 24h16c13.23 0 24-10.77 24-24 0-61.76-50.24-112-112-112H115.31L136 67.31c6.24-6.23 6.24-16.39 0-22.62L115.31 24c-6.23-6.24-16.39-6.24-22.62 0L2.34 114.34a8.015 8.015 0 000 11.32zM419.31 296c-6.23-6.24-16.38-6.24-22.62 0L376 316.69c-6.252 6.252-6.262 16.358 0 22.62L396.69 360H112c-26.47 0-48-21.53-48-48 0-13.23-10.77-24-24-24H24c-13.23 0-24 10.77-24 24 0 61.76 50.24 112 112 112h284.69L376 444.69c-6.252 6.252-6.262 16.358 0 22.62L396.69 488c6.241 6.241 16.38 6.24 22.62 0l90.35-90.34a8.015 8.015 0 000-11.32z' />
        </svg>
      </button>
      <span className={styles.value}>
        {`${
          rates
            ? (rates[to] * (1 / rates[from]) * Number(amount)).toFixed(2)
            : '0.00'
        } ${to}`}
      </span>
    </div>
  );
};
