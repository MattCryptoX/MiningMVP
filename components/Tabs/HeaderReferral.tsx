// Referral/Header.tsx
import { createReferral } from "@/styles/stylesTabs";

import React from "react";
import { Text, TouchableOpacity } from "react-native";

import RowWidget from "@/components/Widgets/RowWidget";

import { useTheme } from "@/providers/ThemeProvider";

import { UserPlus } from "phosphor-react-native";

export default function HeaderReferral() {
  const { theme } = useTheme();

  const styles = createReferral(theme);

  return (
    <RowWidget style={styles.header} justifyContent={"space-between"}>
      <Text style={styles.headerTitle}>Referrals</Text>

      <TouchableOpacity>
        <UserPlus size={25} weight={"fill"} color={"#ffffff"} />
      </TouchableOpacity>
    </RowWidget>
  );
}
