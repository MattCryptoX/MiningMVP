// Referral/Content.tsx
import { createReferral } from "@/styles/stylesTabs";

import React from "react";
import { Text, View, ScrollView, TouchableOpacity } from "react-native";

import { useUser } from "@/providers/UserProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { useReferral } from "@/providers/ReferralProvider";

import CardWidget from "@/components/Widgets/CardWidget";
import ColumnWidget from "@/components/Widgets/ColumnWidget";
import RowWidget from "@/components/Widgets/RowWidget";
import InputWidget from "@/components/Widgets/InputWidget";

import {
  Bed,
  Copy,
  UserCircle,
  PaperPlaneRight,
  UserCircleDashed,
} from "phosphor-react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Referee } from "@/types/referee";

export default function ContentReferral() {
  const { user } = useUser();
  const { theme, translations } = useTheme();
  const {
    state,
    dispatch,
    referee,
    handleCopyToClipboard,
    handleCreateReferral,
  } = useReferral();

  const styles = createReferral(theme);

  return (
    <ScrollView style={styles.content} bounces={false}>
      {state.mode === "Input" ? (
        <CardWidget style={{ marginBottom: 10 }}>
          <RowWidget
            style={{
              backgroundColor: "#25242B",
              borderRadius: 10,
            }}
            justifyContent={"space-between"}
          >
            <InputWidget
              variant={"Special"}
              isPrimary={true}
              value={state.code}
              onChangeText={(text) =>
                dispatch({ type: "SET_CODE", payload: text })
              }
              placeholder={translations.network.content.placeholder}
            />

            <TouchableOpacity
              style={styles.codeAction}
              onPress={() => handleCreateReferral(user?._id)}
            >
              <PaperPlaneRight size={20} weight={"fill"} color={"#ffffff"} />
            </TouchableOpacity>
          </RowWidget>
        </CardWidget>
      ) : (
        <CardWidget style={{ marginBottom: 10 }}>
          <RowWidget
            style={{
              backgroundColor: "#25242B",
              paddingHorizontal: 20,
              height: 60,
              borderRadius: 10,
            }}
            justifyContent={"space-between"}
          >
            <Text style={styles.codeText}>
              {user?.username} | #{user.code}
            </Text>

            <TouchableOpacity
              style={styles.codeAction}
              onPress={() => handleCopyToClipboard(user?.code)}
            >
              <Copy size={20} weight={"fill"} color={"#ffffff"} />
            </TouchableOpacity>
          </RowWidget>
        </CardWidget>
      )}

      {referee?.length > 0 ? (
        referee.map(
          ({ _id, username, email, code, status }: Referee, index: number) => {
            return (
              <CardWidget
                key={_id || index}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 10,
                  paddingHorizontal: 15,
                }}
              >
                <RowWidget style={{ gap: 10 }}>
                  <UserCircle size={40} weight="fill" color="#20AB7D" />
                  <ColumnWidget style={{ alignItems: "flex-start", gap: 5 }}>
                    <Text style={styles.contentText}>
                      {username} | {code}
                    </Text>
                    <Text style={styles.contentText}>{email}</Text>
                  </ColumnWidget>
                </RowWidget>

                <View style={styles.chipView}>
                  <Text
                    style={
                      status === `${translations.network.content.idle}`
                        ? styles.chipIdle
                        : styles.chipActive
                    }
                  >
                    {status?.charAt(0).toUpperCase() + status?.slice(1)}
                  </Text>
                  {status === `${translations.network.content.idle}` ? (
                    <Bed size={20} weight={"fill"} color={"#ab6f20"} />
                  ) : (
                    <MaterialCommunityIcons
                      name={"pickaxe"}
                      size={15}
                      color={"#20AB7D"}
                    />
                  )}
                </View>
              </CardWidget>
            );
          },
        )
      ) : (
        <ColumnWidget
          style={{ marginVertical: 40, gap: 10 }}
          justifyContent={"center"}
        >
          <UserCircleDashed size={200} weight={"fill"} color={"#20AB7D"} />
          <Text style={styles.unknownText}>
            {translations.network.content.unknown}
          </Text>
        </ColumnWidget>
      )}
    </ScrollView>
  );
}
