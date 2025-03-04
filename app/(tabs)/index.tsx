// Home/Index.tsx
import React from "react";
import { View } from "react-native";

import { useUser } from "@/providers/UserProvider";

import LoadingWidget from "@/components/Widgets/LoadingWidget";

export default function HomeScreen() {
  const { isLoading } = useUser();

  if (isLoading) return <LoadingWidget showLogo={false} />;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "red",
      }}
    >
      <></>
    </View>
  );
}
