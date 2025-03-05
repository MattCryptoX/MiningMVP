// hooks/useWorkerState.ts
import { useState, useEffect } from "react";

import { Id } from "@/convex/_generated/dataModel";

import { Worker } from "@/types/worker";

export const useWorkerState = (
  worker: Worker | null,
  handleStopMining: (userId: Id<"user">) => void,
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

      if (remainingTime === 0) {
        handleStopMining(worker.userId);
      }
    } else {
      setTimeLeft(null);
      setEarnedCoins(0);
    }
  }, [worker]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (!prev || prev <= 1000) {
          clearInterval(interval);
          handleStopMining(worker?.userId as Id<"user">);
          setTimeLeft(null);
          setEarnedCoins(0);
          return 0;
        }
        return prev - 1000;
      });

      if (worker?.rate) {
        const ratePerSecond = worker.rate / 3600;

        handleUpdateBalance(
          parseFloat((earnedCoins + ratePerSecond).toFixed(4)),
        );
        setEarnedCoins((prev) => parseFloat((prev + ratePerSecond).toFixed(4)));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, worker?.rate, earnedCoins]);

  const formattedTimeLeft = timeLeft
    ? new Date(timeLeft).toISOString().substr(11, 8)
    : "00:00:00";

  return { timeLeft, formattedTimeLeft, earnedCoins };
};
