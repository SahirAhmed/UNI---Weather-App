import clsx from 'clsx';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import styles from './DateTime.module.css';

export type DateTimeProps = React.HTMLAttributes<HTMLDivElement> & {
  compact?: boolean;
  timeZone?: string;
};

/**
 * displays the current date and time based on a given time zone. has two layouts, a normal layout
 * which takes a significant amount of space and a compact layout which uses a lot less space.
 */
export const DateTime = ({ compact, timeZone, ...props }: DateTimeProps) => {
  const [date, setDate] = useState(dayjs().tz(timeZone));

  // update the current date if the given time zone has changed
  useEffect(() => {
    setDate(dayjs().tz(timeZone));
  }, [timeZone]);

  // update the current date every minute which is the shortest visible duration of time
  useEffect(() => {
    const timeout = setTimeout(
      () => setDate(dayjs().tz(timeZone)),
      60 * 1000 - (date.millisecond() + date.second() * 1000) // wait until the next minute to update
    );

    // remove timers during effect cleanup
    return () => clearTimeout(timeout);
  }, [date, timeZone]);

  return (
    <div
      {...props}
      className={clsx(props.className, styles.container, {
        [styles.compact]: compact
      })}
    >
      <div className={styles.time}>
        <span className={styles.offset}>{date.format('z')}</span>
        <span className={styles.hoursMinutes}>{date.format('h:mm')}</span>
        <span className={styles.amPm}>{date.format('A')}</span>
      </div>
      <div className={styles.date}>{date.format('dddd Do MMMM')}</div>
      <div className={styles.year}>{date.format('YYYY')}</div>
    </div>
  );
};
