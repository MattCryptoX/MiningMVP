// Worker/WorkerProvider.tsx
import React, { useMemo, useContext, createContext } from "react";

import { useUser } from "@/providers/UserProvider";

import { useWorkerState } from "@/hooks/useWorkerState";
import { useWorkerActions } from "@/hooks/useWorkerActions";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import { Worker } from "@/types/worker";

const WorkerContext = createContext<any>(undefined);

export const WorkerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useUser();

  const workerQuery = useQuery(
    api.worker.fetchWorker,
    user ? { userId: user?._id } : "skip",
  );
  const worker = ((workerQuery?.data || null) as Worker) || null;

  const { handleStartMining, handleStopMining, handleUpdateBalance } =
    useWorkerActions(user?._id);
  const { timeLeft, formattedTimeLeft, earnedCoins } = useWorkerState(
    worker,
    handleStopMining,
    handleUpdateBalance,
  );

  const contextValue = useMemo(
    () => ({
      worker,
      handleStartMining,
      handleStopMining,
      timeLeft,
      formattedTimeLeft,
      earnedCoins,
    }),
    [worker, timeLeft, earnedCoins],
  );

  return (
    <WorkerContext.Provider value={contextValue}>
      {children}
    </WorkerContext.Provider>
  );
};

export const useWorker = () => {
  const context = useContext(WorkerContext);
  if (!context) {
    throw new Error("useWorker must be used within a WorkerProvider");
  }
  return context;
};
