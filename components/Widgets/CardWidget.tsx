// Widget/Card.tsx
import { createCard } from "@/styles/stylesWidget";

import React, { ReactNode } from "react";
import { TouchableOpacity, ViewStyle } from "react-native";

import { useTheme } from "@/providers/ThemeProvider";

interface WidgetProps {
  children: ReactNode;
  style?: ViewStyle;
  isTouchable?: boolean;
}

export default function CardWidget({
  children,
  style,
  isTouchable = false,
}: WidgetProps) {
  const { theme } = useTheme();

  const styles = createCard(theme);

  return (
    <TouchableOpacity disabled={!isTouchable} style={[styles.card, style]}>
      {children}
    </TouchableOpacity>
  );
}
