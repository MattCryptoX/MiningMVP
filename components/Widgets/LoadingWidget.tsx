// Widget/Loading.tsx
import { createLoading } from "@/styles/stylesWidget";

import React from "react";
import { Image, SafeAreaView } from "react-native";

import { useTheme } from "@/providers/ThemeProvider";

interface WidgetProps {
  showLogo?: boolean;
}

export default function LoadingWidget({ showLogo = true }: WidgetProps) {
  const { theme } = useTheme();

  const styles = createLoading(theme);

  return (
    <SafeAreaView style={styles.container}>
      {showLogo && (
        <Image
          source={require("@/assets/images/strx.png")}
          style={{ width: 200, height: 200 }}
        />
      )}
    </SafeAreaView>
  );
}
