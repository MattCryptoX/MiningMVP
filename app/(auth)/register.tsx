// Auth/Index.tsx
import { createAuth } from "@/styles/stylesAuth";

import React from "react";
import { SafeAreaView } from "react-native";

import { useTheme } from "@/providers/ThemeProvider";
import { AuthProvider } from "@/providers/AuthProvider";

import ContentRegister from "@/components/Auth/ContentRegister";

export default function Register() {
  const { theme } = useTheme();

  const styles = createAuth(theme);

  return (
    <AuthProvider>
      <SafeAreaView style={styles.container}>
        <ContentRegister />
      </SafeAreaView>
    </AuthProvider>
  );
}
