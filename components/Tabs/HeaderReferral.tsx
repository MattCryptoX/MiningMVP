// Referral/Header.tsx
import { createReferral } from "@/styles/stylesTabs";

import React from "react";
import { Text, TouchableOpacity } from "react-native";

import { useTheme } from "@/providers/ThemeProvider";
import { useReferral } from "@/providers/ReferralProvider";

import RowWidget from "@/components/Widgets/RowWidget";

import { ShareNetwork, UserPlus } from "phosphor-react-native";

export default function HeaderReferral() {
  const { theme } = useTheme();
  const { state, dispatch } = useReferral();

  const styles = createReferral(theme);

  return (
    <RowWidget style={styles.header} justifyContent={"space-between"}>
      <Text style={styles.headerTitle}>Referrals</Text>

      <TouchableOpacity
        onPress={() =>
          dispatch({
            type: "SET_MODE",
            payload: state.mode === "Input" ? "Share" : "Input",
          })
        }
      >
        {state.mode === "Input" ? (
          <ShareNetwork size={25} weight={"fill"} color={"#ffffff"} />
        ) : (
          <UserPlus size={25} weight={"fill"} color={"#ffffff"} />
        )}
      </TouchableOpacity>
    </RowWidget>
  );
}
