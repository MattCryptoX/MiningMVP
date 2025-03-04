// styles/fonts.ts
import { Platform } from "react-native";

export const fonts = {
  inter: {
    thin: Platform.select({
      android: "Inter_100Thin",
      ios: "Inter-Thin",
    }),
    extraLight: Platform.select({
      android: "Inter_200ExtraLight",
      ios: "Inter-ExtraLight",
    }),
    light: Platform.select({
      android: "Inter_300Light",
      ios: "Inter-Light",
    }),
    regular: Platform.select({
      android: "Inter_400Regular",
      ios: "Inter-Regular",
    }),
    medium: Platform.select({
      android: "Inter_500Medium",
      ios: "Inter-Medium",
    }),
    semiBold: Platform.select({
      android: "Inter_600SemiBold",
      ios: "Inter-SemiBold",
    }),
    bold: Platform.select({
      android: "Inter_700Bold",
      ios: "Inter-Bold",
    }),
    extraBold: Platform.select({
      android: "Inter_800ExtraBold",
      ios: "Inter-ExtraBold",
    }),
    black: Platform.select({
      android: "Inter_900Black",
      ios: "Inter-Black",
    }),
  },
};
