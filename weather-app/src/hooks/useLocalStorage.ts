import { useState } from 'react';

/**
 * similar to useState but saves the value to the browser's local storage
 * so that it can be persisted between page refreshes.
 *
 * @param key key in localStorage value should be assigned to
 * @param initialValue initial value to use if no existing value was found
 */
export const useLocalStorage = <T>(
  key: string,
  initialValue?: T
): [
  T | undefined,
  (value: T | undefined | ((value: T | undefined) => T | undefined)) => void
] => {
  const [currentValue, setCurrentValue] = useState<T | undefined>(() => {
    if (typeof window !== 'undefined') {
      try {
        const value = window.localStorage.getItem(key);
        return value ? JSON.parse(value) : initialValue;
      } catch (e) {
        console.log(e);
      }
    }

    return initialValue;
  });

  return [
    currentValue,
    value => {
      const newValue = value instanceof Function ? value(currentValue) : value;
      setCurrentValue(newValue);

      try {
        window.localStorage.setItem(key, JSON.stringify(newValue));
      } catch (e) {
        console.log(e);
      }
    }
  ];
};
