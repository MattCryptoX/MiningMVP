// Home/Index.tsx
import { createHome } from "@/styles/stylesTabs";

import React from "react";
import { SafeAreaView } from "react-native";

import { useUser } from "@/providers/UserProvider";
import { useTheme } from "@/providers/ThemeProvider";

import ContentHome from "@/components/Tabs/ContentHome";
import LoadingWidget from "@/components/Widgets/LoadingWidget";

export default function HomeScreen() {
  const { theme } = useTheme();
  const { isLoading } = useUser();

  const styles = createHome(theme);

  if (isLoading) return <LoadingWidget showLogo={false} />;

  return (
    <SafeAreaView style={styles.screen}>
      <ContentHome />
    </SafeAreaView>
  );
}
