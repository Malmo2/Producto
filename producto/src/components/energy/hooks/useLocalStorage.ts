import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

function useLocalStorage<T>(
  key: string,
  initialValue: T
): readonly [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw != null ? (JSON.parse(raw) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch { }
  }, [key, value]);

  return [value, setValue] as const;
}

export default useLocalStorage;