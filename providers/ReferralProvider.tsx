// Referral/ReferralProvider.tsx
import React, {
  useRef,
  useMemo,
  useState,
  useEffect,
  useContext,
  createContext,
} from "react";

import { useUser } from "@/providers/UserProvider";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const ReferralContext = createContext<any>(undefined);

export const ReferralProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { user } = useUser();

  const contextValue = useMemo(() => ({}), []);

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
