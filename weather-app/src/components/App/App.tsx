import { useCallback } from 'react';
import { Redirect, Route, Switch, useHistory } from 'react-router';
import { AirportProvider } from '../../hooks/useAirport';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { UnitsProvider } from '../../hooks/useUnits';
import { WeatherProvider } from '../../hooks/useWeather';
import { Airport, Location } from '../../types';
import { AirportSelect } from '../AirportSelect';
import { Logo } from '../Logo';
import { Overview } from '../Overview';
import { Settings } from '../Settings';
import { WeatherDetails } from '../WeatherDetails';
import styles from './App.module.css';

// default page user will usually land on
export const HOMEPAGE = '/departure/overview';

/**
 * main component. handles rendering of providers and pages. also holds important application state
 */
export const App = () => {
  const history = useHistory();

  // persistent departure and arrival airport state
  const [departureAirport, setDepartureAirport] = useLocalStorage<Airport>(
    'tailwind-departureAirport'
  );
  const [arrivalAirport, setArrivalAirport] = useLocalStorage<Airport>(
    'tailwind-arrivalAirport'
  );

  // callback to navigate user after selecting an airport
  const handleLocationChange = useCallback(
    (newLocation: Location) => {
      switch (newLocation) {
        case Location.Departure:
          return history.push('/departure/overview');

        case Location.Arrival:
          return history.push('/arrival/overview');
      }
    },
    [history]
  );

  // callbacks after selecting airports
  const handleDepartureAirportChange = useCallback(
    (airport?: Airport) => {
      setDepartureAirport(airport);
      history.push(HOMEPAGE);
    },
    [history, setDepartureAirport]
  );
  const handleArrivalAirportChange = useCallback(
    (airport?: Airport) => {
      setArrivalAirport(airport);
      history.push(HOMEPAGE);
    },
    [history, setArrivalAirport]
  );

  return (
    <div className={styles.container}>
      <Logo className={styles.logo} />

      <div className={styles.page}>
        <UnitsProvider>
          <Switch>
            <Route path='/select/departure' exact>
              <h1 className={styles.title}>Set Departure Airport</h1>
              <AirportSelect
                requestLocation
                onChange={handleDepartureAirportChange}
                value={departureAirport}
              />
            </Route>
            {/* route guard to require departure selection */}
            {!departureAirport && <Redirect to='/select/departure' />}

            <Route path='/select/arrival' exact>
              <h1 className={styles.title}>Set Arrival Airport</h1>
              <AirportSelect
                onChange={handleArrivalAirportChange}
                value={arrivalAirport}
              />
            </Route>
            {/* route guard to require arrival selection */}
            {!arrivalAirport && <Redirect to='/select/arrival' />}

            {/* these routes will only be accessible if arrival and departure airports have been selected */}
            <Route path='/settings' exact>
              <AirportProvider
                departure={departureAirport}
                arrival={arrivalAirport}
                onLocationChange={handleLocationChange}
              >
                <Settings />
              </AirportProvider>
            </Route>

            {/* combined route for arrival and departure location using url parameter */}
            <Route path='/:location?'>
              {({ match }) => {
                const location = match?.params.location as Location;

                // /:location? can match any page hence validate location first
                if (location && Object.values(Location).includes(location)) {
                  return (
                    <AirportProvider
                      departure={departureAirport}
                      arrival={arrivalAirport}
                      location={location}
                      onLocationChange={handleLocationChange}
                    >
                      <WeatherProvider>
                        <Switch>
                          <Route path={`/${location}/overview`} exact>
                            <Overview />
                          </Route>
                          <Route path={`/${location}/weather`}>
                            <WeatherDetails />
                          </Route>

                          {/* redirect to overview if nothing matches */}
                          <Redirect to={`/${location}/overview`} />
                        </Switch>
                      </WeatherProvider>
                    </AirportProvider>
                  );
                }

                // redirect to the homepage if nothing matches
                return <Redirect to={HOMEPAGE} />;
              }}
            </Route>
          </Switch>
        </UnitsProvider>
      </div>
    </div>
  );
};
