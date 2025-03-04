// hooks/useWorkerActions.ts
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export const useWorkerActions = (userId: string | undefined) => {
  const createWorker = useMutation(api.worker.createWorker);
  const deleteWorker = useMutation(api.worker.deleteWorker);
  const updateUser = useMutation(api.user.updateUser);

  const handleStartMining = async () => {
    await createWorker({ userId: userId as Id<"user">, rate: 1 });
  };

  const handleStopMining = async () => {
    await deleteWorker({ userId: userId as Id<"user"> });
  };

  const handleUpdateBalance = async (balance: number) => {
    await updateUser({
      userId: userId as Id<"user">,
      updates: { balance },
    });
  };

  return { handleStartMining, handleStopMining, handleUpdateBalance };
};
