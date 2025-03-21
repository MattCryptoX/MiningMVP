import React, { useMemo, useContext, createContext, useReducer } from "react";

import { useUser } from "@/providers/UserProvider";
import { useTheme } from "@/providers/ThemeProvider";

import * as Clipboard from "expo-clipboard";

import { handleNotifier } from "@/components/Widgets/NotificationWidget";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { User } from "@/types/user";
import { Worker } from "@/types/worker";

const ReferralContext = createContext<any>(undefined);

const referralReducer = (
  state: { code: string; mode: "Share" | "Input" },
  action: { type: string; payload?: string },
) => {
  switch (action.type) {
    case "SET_CODE":
      return { ...state, code: action.payload || "" };
    case "CLEAR_CODE":
      return { ...state, code: "" };
    case "SET_MODE":
      return {
        ...state,
        mode: (action.payload as "Share" | "Input") || "Share",
      };
    default:
      return state;
  }
};

export const ReferralProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { user } = useUser();
  const { translations } = useTheme();

  const createReferral = useMutation(api.referral.createReferral);

  const [state, dispatch] = useReducer(referralReducer, {
    code: "",
    mode: "Share",
  });

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
        status: workerMap.has(user._id)
          ? `${translations.network.content.mining}`
          : `${translations.network.content.idle}`,
      })) || []
    );
  }, [users, workerMap]);

  const miningCount = useMemo(
    () =>
      referee.filter(
        (user) => user.status === `${translations.network.content.mining}`,
      ).length,
    [referee],
  );

  const idleCount = useMemo(
    () =>
      referee.filter(
        (user) => user.status === `${translations.network.content.idle}`,
      ).length,
    [referee],
  );

  const handleCopyToClipboard = async (userCode: string) => {
    if (!userCode) return;

    await Clipboard.setStringAsync(userCode);
  };

  const handleCreateReferral = async (userId: Id<"user">) => {
    if (!state.code) return;

    const result = await createReferral({
      referrerId: userId,
      refereeCode: state.code,
    });

    if (result.success) {
      handleNotifier(
        `${translations.network.notifier.success}`,
        `${translations.network.notifier.successContent}`,
        "success",
      );
      dispatch({ type: "CLEAR_CODE" });
    } else {
      handleNotifier(
        `${translations.network.notifier.fail}`,
        `${translations.network.notifier.failContent}`,
        "error",
      );
      dispatch({ type: "CLEAR_CODE" });
    }
  };

  const contextValue = useMemo(
    () => ({
      state,
      dispatch,
      referee,
      miningCount,
      idleCount,
      handleCopyToClipboard,
      handleCreateReferral,
    }),
    [state, referee, miningCount, idleCount],
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
