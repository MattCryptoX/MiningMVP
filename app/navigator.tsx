// navigator.tsx
import React from "react";

import { UserProvider } from "@/providers/UserProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";

import { Stack } from "expo-router";

export default function MainNavigator() {
  return (
    <UserProvider>
      <ThemeProvider>
        <Stack>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </UserProvider>
  );
}
