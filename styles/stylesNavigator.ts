// styles/Navigator.ts
import { colors } from "@/styles/colors";

import { StyleSheet } from "react-native";

import { Theme } from "@/types/settings";

export const createTabsNavigator = (theme: Theme) => {
  const themeColors = theme === "Dark" ? colors.dark : colors.light;

  return StyleSheet.create({
    button: {
      alignItems: "center",
      justifyContent: "center",
    },
    buttonCircle: {
      bottom: 25,
      width: 60,
      height: 60,
      borderRadius: 30,
    },
    shadow: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 4,
    },
  });
};
