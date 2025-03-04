// Widget/Button.tsx
import { createButton } from "@/styles/stylesWidget";

import React from "react";
import {
  Text,
  ViewStyle,
  TouchableOpacity,
  ActivityIndicator,
  TouchableOpacityProps,
} from "react-native";

import { useTheme } from "@/providers/ThemeProvider";

import { GoogleLogo, FacebookLogo } from "phosphor-react-native";

interface WidgetProps extends TouchableOpacityProps {
  isPrimary?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  content?: string;
  icon?: string;
  style?: ViewStyle;
  onPress?: () => void;
}

export default function ButtonWidget({
  isPrimary = true,
  isLoading = false,
  disabled = false,
  content,
  icon = "",
  style,
  onPress,
}: WidgetProps) {
  const { theme } = useTheme();

  const styles = createButton(theme);

  const renderLogo = (isPrimary: boolean) => {
    const color = isPrimary ? "#FFFFFF" : "#f97316";

    switch (icon) {
      case "google":
        return <GoogleLogo size={32} weight={"fill"} color={color} />;
      case "facebook":
        return <FacebookLogo size={32} weight={"fill"} color={color} />;
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity
      style={[
        style,
        styles.button,
        isPrimary ? styles.viewPrimary : styles.viewSecondary,
        disabled && styles.viewDisabled,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      {renderLogo(isPrimary)}

      {isLoading ? (
        <ActivityIndicator size={"small"} color={"white"} />
      ) : (
        content && (
          <Text
            style={[
              styles.text,
              isPrimary ? styles.textPrimary : styles.textSecondary,
              disabled && styles.textDisabled,
            ]}
          >
            {content}
          </Text>
        )
      )}
    </TouchableOpacity>
  );
}
