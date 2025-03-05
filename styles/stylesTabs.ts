// styles/Tabs.ts
import { fonts } from "@/styles/fonts";
import { colors } from "@/styles/colors";

import { StyleSheet } from "react-native";

import { Theme } from "@/types/settings";

export const createHome = (theme: Theme) => {
  const themeColors = theme === "Dark" ? colors.dark : colors.light;

  return StyleSheet.create({
    screen: {
      flex: 1,
      alignItems: "center",
      backgroundColor: themeColors.view.primary,
    },
    lottie: {
      width: 300,
      height: 275,
    },
    button: {
      width: 100,
      height: 100,
      borderRadius: 50,
      justifyContent: "center",
      alignItems: "center",
    },
    buttonEnabled: {
      backgroundColor: themeColors.accent,
    },
    buttonDisabled: {
      backgroundColor: themeColors.view.disabled,
    },
    balance: {
      fontSize: 40,
      textAlign: "center",
      color: themeColors.accent,
      fontFamily: fonts.inter.bold,
    },
    rate: {
      textAlign: "center",
      color: themeColors.text.disabled,
      fontFamily: fonts.inter.bold,
    },
    title: {
      fontSize: 15,
      color: themeColors.accent,
      fontFamily: fonts.inter.semiBold,
    },
    content: {
      fontSize: 20,
      color: themeColors.white,
      fontFamily: fonts.inter.bold,
    },
    instruction: {
      flex: 1,
      textAlign: "center",
      color: themeColors.white,
      fontFamily: fonts.inter.medium,
    },
  });
};

export const createReferral = (theme: Theme) => {
  const themeColors = theme === "Dark" ? colors.dark : colors.light;

  return StyleSheet.create({
    screen: {
      flex: 1,
      alignItems: "center",
      backgroundColor: themeColors.view.secondary,
    },
    header: {
      height: 50,
      width: "100%",
      paddingHorizontal: 20,
      backgroundColor: themeColors.view.secondary,
    },
    content: {
      flex: 1,
      width: "100%",
      padding: 10,
      backgroundColor: themeColors.view.primary,
    },
    headerTitle: {
      fontSize: 25,
      color: themeColors.accent,
      fontFamily: fonts.inter.bold,
    },
    whiteText: {
      fontSize: 15,
      color: themeColors.white,
    },
    chipView: {
      gap: 5,
      flexDirection: "row",
      paddingHorizontal: 15,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 20,
      backgroundColor: themeColors.view.tertiary,
    },
    chipActive: {
      fontSize: 15,
      color: themeColors.accent,
    },
    chipIdle: {
      fontSize: 15,
      color: themeColors.warning,
    },
  });
};
