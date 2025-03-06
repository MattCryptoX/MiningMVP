// Widget/InputWidget.tsx
import { createInput } from "@/styles/stylesWidget";

import React, { forwardRef } from "react";
import {
  Text,
  View,
  ViewStyle,
  TextInput,
  TouchableOpacity,
  KeyboardTypeOptions,
} from "react-native";

import { useTheme } from "@/providers/ThemeProvider";

import RowWidget from "@/components/Widgets/RowWidget";

import { Eye, EyeSlash } from "phosphor-react-native";

interface WidgetProps {
  variant?: "Normal" | "Special";
  isPrimary?: boolean;
  style?: ViewStyle;
  label?: string;
  value: string;
  onChangeText: (value: string) => void;
  editable?: boolean;
  required?: boolean;
  placeholder: string;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  setSecureTextEntry?: (secureTextEntry: boolean) => void;
  onSubmitEditing?: () => void;
}

const InputWidget = forwardRef<TextInput, WidgetProps>(
  (
    {
      variant = "Normal",
      isPrimary = false,
      style,
      label,
      value,
      onChangeText,
      editable = true,
      required = false,
      placeholder,
      keyboardType = "default",
      secureTextEntry = false,
      setSecureTextEntry,
      onSubmitEditing,
    },
    ref,
  ) => {
    const { theme } = useTheme();

    const styles = createInput(theme);

    return (
      <View style={[{ gap: 10 }, style]}>
        {label || required ? (
          <RowWidget>
            {label && <Text style={styles.label}>{label}</Text>}
            {required && <Text style={styles.asterisk}>*</Text>}
          </RowWidget>
        ) : null}

        <View
          style={[
            styles.view,
            isPrimary ? styles.viewPrimary : styles.viewSecondary,
          ]}
        >
          <TextInput
            ref={ref}
            value={value}
            onChangeText={onChangeText}
            editable={editable}
            placeholder={placeholder}
            placeholderTextColor={"gray"}
            keyboardType={keyboardType}
            autoCapitalize={"none"}
            secureTextEntry={setSecureTextEntry && secureTextEntry}
            onSubmitEditing={onSubmitEditing}
            style={variant === "Special" ? styles.inputSpecial : styles.input}
          />

          {setSecureTextEntry && (
            <TouchableOpacity
              onPress={() => setSecureTextEntry(!secureTextEntry)}
            >
              {secureTextEntry ? (
                <Eye size={25} weight={"fill"} color={"white"} />
              ) : (
                <EyeSlash size={25} weight={"fill"} color={"white"} />
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  },
);

export default InputWidget;
