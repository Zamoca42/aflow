"use client";

import { createContext, useContext, useEffect, useState } from 'react';

interface RateLimitContextType {
  isDisabled: boolean;
  remainingTime: number;
  setRateLimited: (duration: number) => void;
}

const RateLimitContext = createContext<RateLimitContextType | undefined>(undefined);

export function RateLimitProvider({ children }: { children: React.ReactNode }) {
  const [isDisabled, setIsDisabled] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  const setRateLimited = (duration: number) => {
    setIsDisabled(true);
    setRemainingTime(duration);
  };

  useEffect(() => {
    if (remainingTime > 0) {
      const interval = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            setIsDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [remainingTime]);

  return (
    <RateLimitContext.Provider value={{ isDisabled, remainingTime, setRateLimited }}>
      {children}
    </RateLimitContext.Provider>
  );
}

export function useRateLimit() {
  const context = useContext(RateLimitContext);
  if (!context) {
    throw new Error('useRateLimit must be used within a RateLimitProvider');
  }
  return context;
} 