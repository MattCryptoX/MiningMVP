import React, { ReactNode } from "react";
import { View, StyleSheet, ViewStyle } from "react-native";

interface WidgetProps {
  children: ReactNode;
  style?: ViewStyle;
  justifyContent?: ViewStyle["justifyContent"];
}

export default function ColumnWidget({
  children,
  style,
  justifyContent,
}: WidgetProps) {
  return (
    <View style={[styles.row, style, { justifyContent }]}>{children}</View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "column",
    alignItems: "center",
  },
});
