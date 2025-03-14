// Auth/Index.tsx
import { createAuth } from "@/styles/stylesAuth";

import React from "react";
import { SafeAreaView } from "react-native";

import { useUser } from "@/providers/UserProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { AuthenticationProvider } from "@/providers/AuthenticationProvider";

import ContentLogin from "@/components/Auth/ContentLogin";
import LoadingWidget from "@/components/Widgets/LoadingWidget";

export default function LoginScreen() {
  const { theme } = useTheme();
  const { isLoading } = useUser();

  const styles = createAuth(theme);

  if (isLoading) return <LoadingWidget />;

  return (
    <AuthenticationProvider>
      <SafeAreaView style={styles.container}>
        <ContentLogin />
      </SafeAreaView>
    </AuthenticationProvider>
  );
}
