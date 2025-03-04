// Theme/ThemeProvider.tsx
import React, {
  useMemo,
  useState,
  useEffect,
  useContext,
  createContext,
} from "react";
import { useColorScheme } from "react-native";

import { useUser } from "@/providers/UserProvider";

import { useQuery } from "convex/react";
import { api } from "@/convex-api";

import { Theme, UserSettings } from "@/types/settings";

const ThemeContext = createContext<any>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useUser();
  const colorScheme = useColorScheme();

  const settingsQuery = useQuery(
    api.userSettings.fetchUserSettings,
    user ? { userId: user?._id } : "skip",
  );
  const settings = ((settingsQuery?.data || null) as UserSettings) || null;

  const [theme, setTheme] = useState<Theme>("Dark");

  useEffect(() => {
    if (settings?.theme === "System") {
      setTheme(colorScheme === "dark" ? "Dark" : "Light");
    } else if (settings?.theme) {
      setTheme(settings.theme);
    }
  }, [settings, colorScheme]);

  const contextValue = useMemo(() => ({ theme, setTheme }), [theme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
