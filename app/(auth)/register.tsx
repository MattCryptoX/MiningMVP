// Auth/Index.tsx
import { createAuth } from "@/styles/stylesAuth";

import React from "react";
import { SafeAreaView } from "react-native";

import { useTheme } from "@/providers/ThemeProvider";
import { AuthenticationProvider } from "@/providers/AuthenticationProvider";

import ContentRegister from "@/components/Auth/ContentRegister";

export default function Register() {
  const { theme } = useTheme();

  const styles = createAuth(theme);

  return (
    <AuthenticationProvider>
      <SafeAreaView style={styles.container}>
        <ContentRegister />
      </SafeAreaView>
    </AuthenticationProvider>
  );
}
