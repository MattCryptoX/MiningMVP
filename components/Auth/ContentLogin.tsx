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
  const { state, dispatch, handleUrl, clearForm, handleLogin, handleSSO } =
    useAuthentication();

  const styles = createAuth(theme);

  const { emailAddress, password, loading, hidePassword } = state;

  // Input Refs
  const emailRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { paddingHorizontal: 20 }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Logo */}
      <Image
        source={require("@/assets/images/strx.png")}
        style={{ width: 125, height: 125 }}
      />

      {/* Login Form */}
      <ColumnWidget style={{ width: "100%", gap: 15, paddingHorizontal: 20 }}>
        <InputWidget
          style={{ width: "100%" }}
          ref={emailRef}
          label={"Email or Username"}
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
          label={"Password"}
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
          content={"LOGIN"}
          onPress={handleLogin}
        />

        {/* Signup Link */}
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

      {/* Social Login Buttons */}
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
