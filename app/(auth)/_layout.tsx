// (auth)/_layout.tsx
import React from "react";

import { Stack } from "expo-router";

export default function AuthNavigator() {
  return (
    <Stack>
      <Stack.Screen name={"index"} options={{ headerShown: false }} />
      <Stack.Screen name={"register"} options={{ headerShown: false }} />
    </Stack>
  );
}
