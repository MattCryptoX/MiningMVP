// navigator.tsx
import React from "react";

import { Stack } from "expo-router";
import { NotifierWrapper } from "react-native-notifier";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { UserProvider } from "@/providers/UserProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { WorkerProvider } from "@/providers/WorkerProvider";
import { ReferralProvider } from "@/providers/ReferralProvider";

export default function MainNavigator() {
  return (
    <GestureHandlerRootView>
      <NotifierWrapper>
        <UserProvider>
          <ThemeProvider>
            <ReferralProvider>
              <WorkerProvider>
                <Stack>
                  <Stack.Screen
                    name={"(auth)"}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name={"(tabs)"}
                    options={{ headerShown: false }}
                  />
                </Stack>
              </WorkerProvider>
            </ReferralProvider>
          </ThemeProvider>
        </UserProvider>
      </NotifierWrapper>
    </GestureHandlerRootView>
  );
}
