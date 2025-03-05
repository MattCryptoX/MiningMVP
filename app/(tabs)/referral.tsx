// Referral/Index.tsx
import { createReferral } from "@/styles/stylesTabs";

import React from "react";
import { SafeAreaView } from "react-native";

import { useTheme } from "@/providers/ThemeProvider";

import HeaderReferral from "@/components/Tabs/HeaderReferral";
import ContentReferral from "@/components/Tabs/ContentReferral";

export default function ReferralScreen() {
  const { theme } = useTheme();

  const styles = createReferral(theme);

  return (
    <SafeAreaView style={styles.screen}>
      <HeaderReferral />
      <ContentReferral />
    </SafeAreaView>
  );
}
