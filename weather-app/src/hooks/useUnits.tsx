import { createContext, useContext, useState } from 'react';
import { MeasurementSystem } from '../types';

export const DEFAULT_UNITS = MeasurementSystem.Metric;

/**
 * context provider for current measurement system
 */
export const MeasurementSystemContext = createContext<
  [MeasurementSystem, React.Dispatch<React.SetStateAction<MeasurementSystem>>]
>([DEFAULT_UNITS, () => {}]);

export const UnitsProvider = ({ children }: { children?: React.ReactNode }) => {
  const state = useState(DEFAULT_UNITS);

  return (
    <MeasurementSystemContext.Provider value={state}>
      {children}
    </MeasurementSystemContext.Provider>
  );
};

/**
 * gets current measurement system from context
 */
export const useUnits = () => useContext(MeasurementSystemContext);
