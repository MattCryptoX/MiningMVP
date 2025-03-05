// Home/Index.tsx
import React from "react";
import { TouchableOpacity, Text, View } from "react-native";

import { useUser } from "@/providers/UserProvider";
import { useWorker } from "@/providers/WorkerProvider";

import LoadingWidget from "@/components/Widgets/LoadingWidget";

import { Coin } from "phosphor-react-native";

export default function HomeScreen() {
  const { user, isLoading } = useUser();
  const { worker, handleStartMining, formattedTimeLeft, earnedCoins } =
    useWorker();

  if (isLoading) return <LoadingWidget showLogo={false} />;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TouchableOpacity
        style={{
          width: 100,
          height: 100,
          backgroundColor: worker ? "gray" : "green",
          borderRadius: 50,
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={() => handleStartMining(user?._id)}
      >
        <Coin size={32} weight="fill" color={"#fff"} />
      </TouchableOpacity>
      <Text>{formattedTimeLeft}</Text>
      <Text>{earnedCoins}</Text>
    </View>
  );
}
