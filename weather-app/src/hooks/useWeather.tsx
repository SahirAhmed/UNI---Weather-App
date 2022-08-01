import { createContext, useContext, useEffect, useState } from 'react';
import { WeatherInfo } from '../types';
import { useAirport } from './useAirport';
import { useUnits } from './useUnits';

export const WeatherContext = createContext<WeatherInfo>({});

/**
 * context provider for current weather by fetching from the `/api/airport/:airportId/weather`
 * endpoint. relies on both the `AirportProvider` and `UnitsProvider`
 */
export const WeatherProvider = ({
  children
}: {
  children?: React.ReactNode;
}) => {
  const { airport } = useAirport();
  const [units] = useUnits();

  const [weatherInfo, setWeatherInfo] = useState<WeatherInfo>();

  useEffect(() => {
    if (airport) {
      fetch(`/api/airport/${airport.id}/weather?units=${units}`)
        .then(res => res.json())
        .then(newWeatherInfo =>
          setWeatherInfo({
            ...newWeatherInfo,
            // use airport name + city as openweather is less accurate
            name: `${airport.name}, ${airport.city}`
          })
        );
    }
  }, [airport, units]);

  return (
    <WeatherContext.Provider value={weatherInfo ?? {}}>
      {children}
    </WeatherContext.Provider>
  );
};

/**
 * gets current weather information for current airport from context
 */
export const useWeather = () => useContext(WeatherContext);
