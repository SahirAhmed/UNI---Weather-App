import { createContext, useContext } from 'react';
import { Airport, Location } from '../types';

export const AirportContext = createContext<{
  airport?: Airport;
  departure?: Airport;
  arrival?: Airport;
  location?: Location;
  setLocation?: (location: Location) => void;
}>({});

export type AirportProviderProps = {
  departure?: Airport;
  arrival?: Airport;
  location?: Location;
  onLocationChange?: (location: Location) => void;
  children?: React.ReactNode;
};

/**
 * context provider for airport selection and current location
 */
export const AirportProvider = ({
  children,
  onLocationChange,
  ...props
}: AirportProviderProps) => {
  let airport;

  switch (props.location) {
    case Location.Departure:
      airport = props.departure;
      break;

    case Location.Arrival:
      airport = props.arrival;
      break;
  }

  return (
    <AirportContext.Provider
      value={{ ...props, airport, setLocation: onLocationChange }}
    >
      {children}
    </AirportContext.Provider>
  );
};

/**
 * gets airport selection and current location from context
 */
export const useAirport = () => useContext(AirportContext);
