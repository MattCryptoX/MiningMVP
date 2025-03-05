import React, { useMemo, useContext, createContext } from "react";

import { useUser } from "@/providers/UserProvider";
import { useWorker } from "@/providers/WorkerProvider";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import { User } from "@/types/user";
import { Worker } from "@/types/worker";

const ReferralContext = createContext<any>(undefined);

export const ReferralProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { user } = useUser();

  const referralsQuery = useQuery(
    api.referral.fetchReferrals,
    user ? { userId: user?._id } : "skip",
  );
  const referrals = referralsQuery?.flattenedIds || null;

  const usersQuery = useQuery(
    api.user.fetchUsers,
    referrals ? { userIds: referrals } : "skip",
  );
  const users = ((usersQuery?.data || null) as User[]) || null;

  const workersQuery = useQuery(
    api.worker.fetchWorkers,
    referrals ? { userIds: referrals } : "skip",
  );
  const workers = ((workersQuery?.data || null) as Worker[]) || null;

  const workerMap = useMemo(() => {
    return new Map(workers?.map((worker) => [worker.userId, worker]) || []);
  }, [workers]);

  const referee = useMemo(() => {
    return (
      users?.map((user) => ({
        ...user,
        status: workerMap.has(user._id) ? "mining" : "idle",
      })) || []
    );
  }, [users, workerMap]);

  const miningCount = useMemo(
    () => referee.filter((user) => user.status === "mining").length,
    [referee],
  );

  const idleCount = useMemo(
    () => referee.filter((user) => user.status === "idle").length,
    [referee],
  );

  const contextValue = useMemo(
    () => ({ referee, miningCount, idleCount }),
    [referee, miningCount, idleCount],
  );

  return (
    <ReferralContext.Provider value={contextValue}>
      {children}
    </ReferralContext.Provider>
  );
};

export const useReferral = () => {
  const context = useContext(ReferralContext);
  if (!context) {
    throw new Error("useReferral must be used within a ReferralProvider");
  }
  return context;
};
