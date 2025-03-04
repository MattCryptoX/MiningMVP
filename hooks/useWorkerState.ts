// hooks/useWorkerState.ts
import React, { useState, useEffect } from "react";

import { Worker } from "@/types/worker";

export const useWorkerState = (
  worker: Worker | null,
  handleStopMining: () => void,
  handleUpdateBalance: (balance: number) => void,
) => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [earnedCoins, setEarnedCoins] = useState<number>(0);

  useEffect(() => {
    if (worker?._creationTime) {
      const expirationTime = worker._creationTime + 24 * 60 * 60 * 1000; // 24 hours in ms
      const now = Date.now();
      const remainingTime = Math.max(expirationTime - now, 0);

      setTimeLeft(remainingTime);

      if (remainingTime === 0) handleStopMining();
    }
  }, [worker]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (!prev || prev <= 1000) {
          clearInterval(interval);
          handleStopMining();
          return 0;
        }
        return prev - 1000;
      });

      // Calculate earned coins based on rate
      if (worker?._creationTime) {
        const elapsedTime = Date.now() - worker._creationTime;
        const rate = worker?.rate || 1; // Default to 1 if not set
        const coins = (elapsedTime / (60 * 60 * 1000)) * rate; // Adjusted for rate
        setEarnedCoins(parseFloat(coins.toFixed(4))); // Display up to 4 decimal places
        handleUpdateBalance(parseFloat(coins.toFixed(4)));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, worker?.rate]);

  const formattedTimeLeft = timeLeft
    ? new Date(timeLeft).toISOString().substr(11, 8)
    : "00:00:00";

  return { timeLeft, formattedTimeLeft, earnedCoins };
};
