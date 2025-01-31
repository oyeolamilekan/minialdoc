import { useEffect, useState } from 'react';

type UseSessionStorageReturn<T> = {
  value: T | undefined;
  updateValue: (newValue: T) => void;
};

const useSessionStorage = <T>(key: string, defaultValue?: T): UseSessionStorageReturn<T> => {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    // Retrieve from localStorage
    const item = window.sessionStorage.getItem(key);

    if (item) {
      setValue(JSON.parse(item));
    }
  }, [key]);

  const updateValue = (newValue: T) => {
    window?.sessionStorage.setItem(key, JSON.stringify(newValue));
    setValue(newValue);
  };

  return { value, updateValue };
};

const clearSessionStorage = () => {
  sessionStorage.clear();
};

export { clearSessionStorage, useSessionStorage };