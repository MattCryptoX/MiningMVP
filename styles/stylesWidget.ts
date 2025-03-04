// styles/Widget.ts
import { fonts } from "@/styles/fonts";
import { colors } from "@/styles/colors";

import { StyleSheet } from "react-native";

import { Theme } from "@/types/settings";
export const createLoading = (theme: Theme) => {
  const themeColors = theme === "Dark" ? colors.dark : colors.light;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColors.view.primary,
      justifyContent: "center",
      alignItems: "center",
    },
  });
};

export const createInput = (theme: Theme) => {
  const themeColors = theme === "Dark" ? colors.dark : colors.light;

  return StyleSheet.create({
    label: {
      fontSize: 15,
      color: themeColors.accent,
      fontFamily: fonts.inter.bold,
    },
    asterisk: {
      fontSize: 15,
      color: themeColors.negative,
      fontFamily: fonts.inter.bold,
    },
    view: {
      height: 60,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 15,
      borderRadius: 10,
    },
    viewPrimary: {
      backgroundColor: themeColors.view.primary,
    },
    viewSecondary: {
      backgroundColor: themeColors.view.secondary,
    },
    input: {
      fontSize: 15,
      color: themeColors.text.primary,
      fontFamily: fonts.inter.semiBold,
    },
    pinCodeContainer: {
      width: 50,
      height: 50,
      borderRadius: 10,
      borderColor: themeColors.view.primary,
      backgroundColor: themeColors.view.secondary,
    },
    pinCodeText: {
      fontSize: 15,
      color: themeColors.text.primary,
      fontFamily: fonts.inter.semiBold,
    },
    placeholderText: {
      marginBottom: 5,
    },
  });
};

export const createButton = (theme: Theme) => {
  const themeColors = theme === "Dark" ? colors.dark : colors.light;

  return StyleSheet.create({
    button: {
      gap: 5,
      height: 60,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10,
    },
    viewDisabled: {
      backgroundColor: themeColors.view.disabled,
    },
    viewPrimary: {
      backgroundColor: themeColors.accent,
    },
    viewSecondary: {
      backgroundColor: themeColors.view.secondary,
    },
    text: {
      fontSize: 17.5,
      fontFamily: fonts.inter.bold,
    },
    textDisabled: {
      color: themeColors.text.disabled,
    },
    textPrimary: {
      color: themeColors.white,
    },
    textSecondary: {
      color: themeColors.accent,
    },
  });
};
