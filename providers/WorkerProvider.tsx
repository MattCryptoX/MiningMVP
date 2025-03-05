// Worker/WorkerProvider.tsx
import React, { useEffect, useMemo, useContext, createContext } from "react";
import { AppState } from "react-native";

import BackgroundService from "react-native-background-actions";

import { useUser } from "@/providers/UserProvider";
import { useWorkerState } from "@/hooks/useWorkerState";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { Worker } from "@/types/worker";

const WorkerContext = createContext<any>(undefined);

const backgroundOptions = {
  taskName: "Mining Worker",
  taskTitle: "Worker is mining...",
  taskDesc: "Mining coins in the background",
  taskIcon: {
    name: "ic_launcher",
    type: "mipmap",
  },
  color: "#ff00ff",
  linkingURI: "yourSchemeHere://mining",
  parameters: {
    delay: 1000,
  },
};

export const WorkerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useUser();

  const createWorker = useMutation(api.worker.createWorker);
  const deleteWorker = useMutation(api.worker.deleteWorker);
  const updateUser = useMutation(api.user.updateUser);

  const workerQuery = useQuery(
    api.worker.fetchWorker,
    user ? { userId: user?._id } : "skip",
  );
  const worker = ((workerQuery?.data || null) as Worker) || null;

  const handleStartMining = async (userId: Id<"user">) => {
    await createWorker({ userId, rate: 1 });
  };

  const handleStopMining = async (userId: Id<"user">) => {
    await deleteWorker({ userId });
  };

  const handleUpdateBalance = async (earnedAmount: number) => {
    if (!user) return;

    const updatedBalance = (user.balance || 0) + earnedAmount;

    await updateUser({
      userId: user._id as Id<"user">,
      updates: { balance: updatedBalance },
    });
  };

  const { timeLeft, formattedTimeLeft, earnedCoins } = useWorkerState(
    worker,
    handleStopMining,
    handleUpdateBalance,
  );

  useEffect(() => {
    const startBackgroundService = async () => {
      try {
        const backgroundTask = async (taskData?: { delay: number }) => {
          const delay = taskData?.delay ?? 1000;
          while (BackgroundService.isRunning()) {
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        };

        await BackgroundService.start(backgroundTask, backgroundOptions);
      } catch (error) {
        console.error("Error starting background service:", error);
      }
    };

    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === "active") {
        BackgroundService.stop();
      } else {
        startBackgroundService();
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
      BackgroundService.stop();
    };
  }, []);

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
