// Home/Content.tsx
import { createHome } from "@/styles/stylesTabs";

import React, { useEffect, useRef } from "react";
import { Text } from "react-native";

import LottieView from "lottie-react-native";

import { useUser } from "@/providers/UserProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { useWorker } from "@/providers/WorkerProvider";

import ButtonWidget from "@/components/Widgets/ButtonWidget";
import CardWidget from "@/components/Widgets/CardWidget";
import RowWidget from "@/components/Widgets/RowWidget";
import ColumnWidget from "@/components/Widgets/ColumnWidget";
import TouchableCardWidget from "@/components/Widgets/TouchableCardWidget";

import { CaretRight, Handshake } from "phosphor-react-native";

export default function ContentHome() {
  const { user } = useUser();
  const { theme, translations } = useTheme();
  const { worker, handleStartMining, formattedTimeLeft } = useWorker();

  const styles = createHome(theme);

  const animation = useRef<LottieView>(null);

  useEffect(() => {
    if (worker) {
      animation.current?.play();
    } else {
      animation.current?.reset();
    }
  }, [worker]);

  return (
    <>
      <LottieView
        ref={animation}
        autoPlay={false}
        style={styles.lottie}
        source={require("@/assets/animation/mine.json")}
      />

      <CardWidget style={{ width: "90%", gap: 40 }}>
        <ColumnWidget style={{ gap: 5 }}>
          <Text style={styles.balance}>
            {isNaN(user?.balance) ? 0 : user?.balance?.toFixed(4)}
          </Text>
          <Text style={styles.rate}>
            +{isNaN(worker?.rate) ? 0 : (worker?.rate).toFixed(2)} STRX/hr
          </Text>
        </ColumnWidget>

        <RowWidget justifyContent={"space-evenly"}>
          <ColumnWidget>
            <Text style={styles.title}>{translations.home.content.time}</Text>
            <Text style={styles.content}>{formattedTimeLeft}</Text>
          </ColumnWidget>

          <ColumnWidget>
            <Text style={styles.title}>
              {translations.home.content.multiplier}
            </Text>
            <Text style={styles.content}>
              {worker?.rate?.toFixed(2) || 1.0}
            </Text>
          </ColumnWidget>
        </RowWidget>

        <ButtonWidget
          style={{ width: "100%" }}
          icon={"mining"}
          content={translations.home.content.mining}
          disabled={worker}
          onPress={() => handleStartMining(user?._id)}
        />
      </CardWidget>

      <TouchableCardWidget style={{ width: "90%", marginTop: 20 }}>
        <RowWidget
          style={{
            gap: 20,
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Handshake size={30} weight={"fill"} color={"#20AB7D"} />

          <Text style={styles.instruction} numberOfLines={2}>
            {translations.home.content.handshake}
          </Text>

          <CaretRight size={30} weight={"fill"} color={"#ffffff"} />
        </RowWidget>
      </TouchableCardWidget>
    </>
  );
}
