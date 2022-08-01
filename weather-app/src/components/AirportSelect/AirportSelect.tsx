import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import Select from 'react-select/async';
import { Airport } from '../../types';
import styles from './AirportSelect.module.css';

export type AirportSelectProps = {
  /**
   * closest airports will be shown initially if true.
   * only useful when selecting the departure location
   */
  requestLocation?: boolean;
  onChange?: (airport?: Airport) => void;
  value?: Airport;
};

/**
 * displays a dropdown list of airports using [react-select](https://react-select.com/home).
 * airports are fetched from the `/api/airports` endpoint and can be sorted by the closest airports
 * first if geolocation permission is given by the user.
 */
export const AirportSelect = ({
  requestLocation,
  onChange,
  value
}: AirportSelectProps) => {
  const location = useLocation();
  const [coordinates, setCoordinates] = useState<[number, number]>();
  const [closestAirports, setClosestAirports] = useState<Airport[]>();

  useEffect(() => {
    if (requestLocation) {
      navigator.geolocation?.getCurrentPosition(({ coords }) => {
        setCoordinates([coords.latitude, coords.longitude]);
        fetch(
          `/api/airports?latitude=${coords.latitude}&longitude=${coords.longitude}`
        )
          .then(res => res.json())
          .then(airports => setClosestAirports(airports));
      });
    }
  }, [requestLocation]);

  // automatically select the closest airport by default if automatic=true is present in the query string
  const isAutomatic =
    new URLSearchParams(location.search).get('automatic') === 'true';

  useEffect(() => {
    if (closestAirports && isAutomatic) {
      onChange?.(closestAirports?.[0]);
    }
  }, [closestAirports, isAutomatic, onChange]);

  if (isAutomatic) {
    return (
      <div className={styles.automatic}>
        Finding the closest airport to your current location...
        <div className={styles.loading} />
      </div>
    );
  }

  // TODO: implement pagination for results, will need virtualization for this
  return (
    <Select<Airport>
      className={styles.select}
      isSearchable
      autoFocus
      menuIsOpen
      cacheOptions
      defaultOptions={closestAirports}
      loadOptions={inputValue =>
        // refetches airports based on user input
        fetch(
          `/api/airports?search=${inputValue}${
            coordinates
              ? `&latitude=${coordinates[0]}&longitude=${coordinates[1]}`
              : ''
          }`
        ).then(res => res.json())
      }
      formatOptionLabel={(airport, { context }) =>
        context === 'value' ? (
          airport.name
        ) : (
          <div>
            <div>{airport.name}</div>
            <div>{airport.city}</div>
          </div>
        )
      }
      noOptionsMessage={({ inputValue }) =>
        inputValue
          ? `No airports found for '${inputValue}'`
          : 'Start typing to search for an airport'
      }
      getOptionValue={airport => airport.id}
      onChange={airport => onChange?.(airport ?? undefined)}
      value={value ?? null}
    />
  );
};
