// Widget/Card.tsx
import { createCard } from "@/styles/stylesWidget";

import React, { ReactNode } from "react";
import { View, ViewStyle } from "react-native";

import { useTheme } from "@/providers/ThemeProvider";

interface WidgetProps {
  children: ReactNode;
  style?: ViewStyle;
}

export default function CardWidget({ children, style }: WidgetProps) {
  const { theme } = useTheme();

  const styles = createCard(theme);

  return <View style={[styles.card, style]}>{children}</View>;
}
