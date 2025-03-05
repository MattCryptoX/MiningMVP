// hooks/useWorkerState.ts
import { useRef, useState, useEffect } from "react";

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
      const expirationTime = worker._creationTime + 24 * 60 * 60 * 1000;
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

  const secondsCounterRef = useRef(0);
  const accumulatedEarningsRef = useRef(0);

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
        const earned = parseFloat(ratePerSecond.toFixed(4));

        accumulatedEarningsRef.current += earned;
        setEarnedCoins((prev) => parseFloat((prev + earned).toFixed(4)));

        secondsCounterRef.current++;

        if (secondsCounterRef.current >= 30) {
          handleUpdateBalance(accumulatedEarningsRef.current);
          accumulatedEarningsRef.current = 0;
          secondsCounterRef.current = 0;
        }
      }
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [timeLeft, worker]);

  const formattedTimeLeft = timeLeft
    ? new Date(timeLeft).toISOString().substr(11, 8)
    : "00:00:00";

  return { timeLeft, formattedTimeLeft, earnedCoins };
};
