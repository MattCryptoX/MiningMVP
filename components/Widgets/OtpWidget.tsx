// Widget/OtpWidget.tsx
import { createInput } from "@/styles/stylesWidget";

import React, { forwardRef } from "react";
import { Text, View, ViewStyle } from "react-native";

import { useTheme } from "@/providers/ThemeProvider";

import { OtpInput, OtpInputRef } from "react-native-otp-entry";

import RowWidget from "@/components/Widgets/RowWidget";

interface WidgetProps {
  isPrimary?: boolean;
  style?: ViewStyle;
  label?: string;
  value: string;
  onChangeText: (value: string) => void;
  required?: boolean;
  onSubmitEditing?: () => void;
}

const OtpWidget = forwardRef<OtpInputRef, WidgetProps>(
  (
    {
      isPrimary = true,
      style,
      label,
      value,
      onChangeText,
      required = false,
      onSubmitEditing,
    },
    ref,
  ) => {
    const { theme } = useTheme();

    const styles = createInput(theme);

    return (
      <View style={[{ gap: 10 }, style]}>
        <RowWidget>
          {label && <Text style={styles.label}>{label}</Text>}
          {required && <Text style={styles.asterisk}>*</Text>}
        </RowWidget>

        <View style={[styles.view, { paddingHorizontal: 0 }]}>
          <OtpInput
            ref={ref}
            placeholder={"••••••"}
            numberOfDigits={6}
            focusColor={"#f97316"}
            onTextChange={onChangeText}
            // onFilled={onSubmitEditing} TODO: Fix onFilled behavior
            theme={{
              pinCodeContainerStyle: styles.pinCodeContainer,
              pinCodeTextStyle: styles.pinCodeText,
              placeholderTextStyle: styles.placeholderText,
            }}
          />
        </View>
      </View>
    );
  },
);

export default OtpWidget;
