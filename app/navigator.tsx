// navigator.tsx
import React from "react";

import { Stack } from "expo-router";
import { NotifierWrapper } from "react-native-notifier";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { UserProvider } from "@/providers/UserProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { WorkerProvider } from "@/providers/WorkerProvider";

export default function MainNavigator() {
  return (
    <GestureHandlerRootView>
      <NotifierWrapper>
        <UserProvider>
          <ThemeProvider>
            <WorkerProvider>
              <Stack>
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              </Stack>
            </WorkerProvider>
          </ThemeProvider>
        </UserProvider>
      </NotifierWrapper>
    </GestureHandlerRootView>
  );
}
