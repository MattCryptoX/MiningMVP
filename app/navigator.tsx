// navigator.tsx
import React from "react";

import { Stack } from "expo-router";

export default function MainNavigator() {
  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
