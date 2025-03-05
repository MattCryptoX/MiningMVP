// Referral/Header.tsx
import { createReferral } from "@/styles/stylesTabs";

import React from "react";
import { Text, View, ScrollView } from "react-native";

import { useTheme } from "@/providers/ThemeProvider";
import { useReferral } from "@/providers/ReferralProvider";

import CardWidget from "@/components/Widgets/CardWidget";

import { Bed, UserCircle } from "phosphor-react-native";
import ColumnWidget from "@/components/Widgets/ColumnWidget";
import RowWidget from "@/components/Widgets/RowWidget";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Referee } from "@/types/referee";

export default function ContentReferral() {
  const { theme } = useTheme();
  const { referee } = useReferral();

  const styles = createReferral(theme);

  return (
    <ScrollView style={styles.content} bounces={false}>
      {referee.map(
        ({ _id, username, email, status }: Referee, index: number) => {
          const formattedId = `#${_id.slice(0, 4)}${_id.slice(-4)}`;

          return (
            <CardWidget
              key={_id || index}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <RowWidget style={{ gap: 10 }}>
                <UserCircle size={40} weight="fill" color="#20AB7D" />
                <ColumnWidget style={{ alignItems: "flex-start", gap: 5 }}>
                  <Text style={styles.whiteText}>
                    {username} | {formattedId}
                  </Text>
                  <Text style={styles.whiteText}>{email}</Text>
                </ColumnWidget>
              </RowWidget>

              <View style={styles.chipView}>
                <Text
                  style={
                    status === "idle" ? styles.chipIdle : styles.chipActive
                  }
                >
                  {status?.charAt(0).toUpperCase() + status?.slice(1)}{" "}
                </Text>
                {status === "idle" ? (
                  <Bed size={20} weight="fill" color="#ab6f20" />
                ) : (
                  <MaterialCommunityIcons
                    name="pickaxe"
                    size={15}
                    color="#20AB7D"
                  />
                )}
              </View>
            </CardWidget>
          );
        },
      )}
    </ScrollView>
  );
}
