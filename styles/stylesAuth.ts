// styles/Auth.ts
import { fonts } from "@/styles/fonts";
import { colors } from "@/styles/colors";

import { StyleSheet } from "react-native";

import { Theme } from "@/types/settings";

export const createAuth = (theme: Theme) => {
  const themeColors = theme === "Dark" ? colors.dark : colors.light;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColors.view.primary,
    },
    screen: {
      flex: 1,
      justifyContent: "space-evenly",
      alignItems: "center",
    },
    textWhite: {
      fontSize: 15,
      color: themeColors.white,
      fontFamily: fonts.inter.medium,
    },
    textPrimary: {
      fontSize: 15,
      color: themeColors.accent,
      fontFamily: fonts.inter.bold,
    },
  });
};
