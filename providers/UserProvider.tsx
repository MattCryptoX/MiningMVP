// User/UserProvider.tsx
import React, {
  useRef,
  useMemo,
  useState,
  useEffect,
  useContext,
  createContext,
} from "react";

import { useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import { User } from "@/types/user";

const UserContext = createContext<any>(undefined);

export const UserProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { signOut } = useAuth();
  const router = useRouter();
  const { userId: clerkId, isSignedIn } = useAuth();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const hasNavigated = useRef<boolean>(false);

  const userQuery = useQuery(api.user.fetchUser, {
    clerkId: clerkId || "skip",
  });
  const user = ((userQuery?.data || null) as User) || null;

  const stopLoading = (delay: number) => {
    setTimeout(() => {
      setIsLoading(false);
    }, delay);
  };

  useEffect(() => {
    if (!user && !isSignedIn) return;
    if (!user && isSignedIn) return;

    if (!hasNavigated.current && user?._id) {
      hasNavigated.current = true;
      router.push("/(tabs)");
    }

    stopLoading(1000);
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    hasNavigated.current = false;
    stopLoading(0);
    router.replace("/(auth)");
  };

  const contextValue = useMemo(
    () => ({ user, isLoading, handleLogout }),
    [user, isLoading, handleLogout],
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
