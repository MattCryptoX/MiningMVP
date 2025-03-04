// navigator.tsx
import React from "react";

import { UserProvider } from "@/providers/UserProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";

import { Stack } from "expo-router";
import { NotifierWrapper } from "react-native-notifier";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function MainNavigator() {
  return (
    <UserProvider>
      <ThemeProvider>
        <GestureHandlerRootView>
          <NotifierWrapper>
            <Stack>
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
          </NotifierWrapper>
        </GestureHandlerRootView>
      </ThemeProvider>
    </UserProvider>
  );
}
