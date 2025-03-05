// Widget/TouchableCard.tsx
import { createCard } from "@/styles/stylesWidget";

import React, { ReactNode } from "react";
import {
  ViewStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

import { useTheme } from "@/providers/ThemeProvider";

interface WidgetProps extends TouchableOpacityProps {
  children: ReactNode;
  disabled?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export default function TouchableCardWidget({
  children,
  style,
  onPress,
}: WidgetProps) {
  const { theme } = useTheme();

  const styles = createCard(theme);

  return (
    <TouchableOpacity style={[styles.card, style]} onPress={onPress}>
      {children}
    </TouchableOpacity>
  );
}
