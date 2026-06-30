import { useEffect, useState } from "react";

export function useLocalDraft<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;

    try {
      const stored = window.localStorage.getItem(key);
      return stored ? { ...initialValue, ...JSON.parse(stored) } : initialValue;
    } catch {
      return initialValue;
    }
  });

  const [status, setStatus] = useState<"saved" | "cleared">("saved");

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
    setStatus("saved");
  }, [key, value]);

  const clearDraft = () => {
    window.localStorage.removeItem(key);
    setValue(initialValue);
    setStatus("cleared");
  };

  return { value, setValue, status, clearDraft };
}
