import React, { useReducer, useEffect, useContext, createContext } from "react";
import { useColorScheme } from "react-native";
import { useUser } from "@/providers/UserProvider";
import { getLocales } from "expo-localization";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import en from "@/language/en.json";

import { Theme, UserSettings } from "@/types/settings";

const translationsMap: Record<string, Record<string, any>> = {
  en,
};

const deviceLanguage = getLocales()[0]?.languageCode || "en";

const ThemeContext = createContext<any>(undefined);

const initialState = {
  theme: "Dark" as Theme,
  language: deviceLanguage,
  translations: translationsMap[deviceLanguage],
};

type Action =
  | { type: "SET_THEME"; payload: Theme }
  | { type: "SET_LANGUAGE"; payload: string };

const themeReducer = (state: typeof initialState, action: Action) => {
  switch (action.type) {
    case "SET_THEME":
      return { ...state, theme: action.payload };
    case "SET_LANGUAGE":
      return {
        ...state,
        language: action.payload,
        translations: translationsMap[action.payload] || translationsMap["en"],
      };
    default:
      return state;
  }
};

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

  const [state, dispatch] = useReducer(themeReducer, initialState);

  useEffect(() => {
    if (settings?.theme === "System") {
      dispatch({
        type: "SET_THEME",
        payload: colorScheme === "dark" ? "Dark" : "Light",
      });
    } else if (settings?.theme) {
      dispatch({ type: "SET_THEME", payload: settings.theme });
    }

    if (settings?.language && translationsMap[settings.language]) {
      dispatch({ type: "SET_LANGUAGE", payload: settings.language });
    } else {
      dispatch({ type: "SET_LANGUAGE", payload: deviceLanguage });
    }
  }, [settings, colorScheme]);

  return (
    <ThemeContext.Provider value={{ ...state, dispatch }}>
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
