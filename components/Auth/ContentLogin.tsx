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
  const { theme } = useTheme();
  const router = useRouter();
  const { state, actions, handleUrl, clearForm, handleLogin, handleSSO } =
    useAuthentication();

  const styles = createAuth(theme);

  const { emailAddress, password, loading, hidePassword } = state;
  const { setEmailAddress, setPassword, setHidePassword } = actions;

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

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
          label={"Email or Username"}
          value={emailAddress}
          onChangeText={setEmailAddress}
          placeholder={"johndoe@gmail.com"}
          onSubmitEditing={() => passwordRef.current?.focus()}
        />
        <InputWidget
          style={{ width: "100%" }}
          ref={passwordRef}
          label={"Password"}
          value={password}
          onChangeText={setPassword}
          placeholder={"••••••"}
          secureTextEntry={hidePassword}
          setSecureTextEntry={setHidePassword}
          onSubmitEditing={handleLogin}
        />
        <ButtonWidget
          style={{ width: "100%", marginTop: 15 }}
          isLoading={loading}
          content={"LOGIN"}
          onPress={handleLogin}
        />

        <RowWidget style={{ gap: 5 }}>
          <Text style={styles.textWhite}>Not a member?</Text>
          <TouchableOpacity
            disabled={loading}
            onPress={() => {
              clearForm();
              router.push("/register");
            }}
          >
            <Text style={styles.textPrimary}>Sign Up</Text>
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

      <ColumnWidget style={{ width: "100%", gap: 5, paddingHorizontal: 20 }}>
        <Text style={styles.textWhite}>
          By using Strx, you are agreeing to our
        </Text>
        <TouchableOpacity onPress={handleUrl}>
          <Text style={styles.textPrimary}>Terms of Service</Text>
        </TouchableOpacity>
      </ColumnWidget>
    </KeyboardAvoidingView>
  );
}
