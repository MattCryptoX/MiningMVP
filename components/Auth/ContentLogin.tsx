// Auth/Login.tsx
import { createAuth } from "@/styles/stylesAuth";

import React, { useRef } from "react";
import {
  Text,
  Image,
  Platform,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";

import { useRouter } from "expo-router";
import { useTheme } from "@/providers/ThemeProvider";
import { useAuthentication } from "@/providers/AuthenticationProvider";

import ColumnWidget from "@/components/Widgets/ColumnWidget";
import InputWidget from "@/components/Widgets/InputWidget";
import ButtonWidget from "@/components/Widgets/ButtonWidget";
import RowWidget from "@/components/Widgets/RowWidget";

export default function ContentLogin() {
  const { theme, translations } = useTheme();
  const router = useRouter();
  const { state, dispatch, handleUrl, clearForm, handleLogin, handleSSO } =
    useAuthentication();

  const styles = createAuth(theme);

  const { emailAddress, password, loading, hidePassword } = state;

  const emailRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { paddingHorizontal: 20 }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Image
        source={require("@/assets/images/strx.png")}
        style={{ width: 125, height: 125 }}
      />

      <ColumnWidget style={{ width: "100%", gap: 15, paddingHorizontal: 20 }}>
        <InputWidget
          style={{ width: "100%" }}
          ref={emailRef}
          label={translations.auth.login.labelOne}
          value={emailAddress}
          onChangeText={(text) =>
            dispatch({ type: "SET_FIELD", field: "emailAddress", value: text })
          }
          placeholder={"johndoe@gmail.com"}
          onSubmitEditing={() => passwordRef.current?.focus()}
        />
        <InputWidget
          style={{ width: "100%" }}
          ref={passwordRef}
          label={translations.auth.login.labelTwo}
          value={password}
          onChangeText={(text) =>
            dispatch({ type: "SET_FIELD", field: "password", value: text })
          }
          placeholder={"••••••"}
          secureTextEntry={hidePassword}
          setSecureTextEntry={() =>
            dispatch({ type: "TOGGLE_PASSWORD_VISIBILITY" })
          }
          onSubmitEditing={handleLogin}
        />
        <ButtonWidget
          style={{ width: "100%", marginTop: 15 }}
          isLoading={loading}
          content={translations.auth.login.login}
          onPress={handleLogin}
        />

        <RowWidget style={{ gap: 5 }}>
          <Text style={styles.textWhite}>
            {translations.auth.login.guideOne}
          </Text>
          <TouchableOpacity
            disabled={loading}
            onPress={() => {
              clearForm();
              router.push("/register");
            }}
          >
            <Text style={styles.textPrimary}>
              {translations.auth.login.link}
            </Text>
          </TouchableOpacity>
        </RowWidget>
      </ColumnWidget>

      <RowWidget style={{ gap: 25 }}>
        <ButtonWidget
          isLoading={loading}
          icon={"facebook"}
          style={{ width: 100 }}
          onPress={() => handleSSO("oauth_facebook")}
        />
        <ButtonWidget
          isLoading={loading}
          icon={"google"}
          style={{ width: 100 }}
          onPress={() => handleSSO("oauth_google")}
        />
      </RowWidget>

      {/* Terms of Service */}
      <ColumnWidget style={{ width: "100%", gap: 5, paddingHorizontal: 20 }}>
        <Text style={styles.textWhite}>{translations.auth.login.guideTwo}</Text>
        <TouchableOpacity onPress={handleUrl}>
          <Text style={styles.textPrimary}>
            {translations.auth.login.terms}
          </Text>
        </TouchableOpacity>
      </ColumnWidget>
    </KeyboardAvoidingView>
  );
}
