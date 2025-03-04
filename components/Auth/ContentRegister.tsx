// Auth/Register.tsx
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

import { OtpInputRef } from "react-native-otp-entry";

import ColumnWidget from "@/components/Widgets/ColumnWidget";
import InputWidget from "@/components/Widgets/InputWidget";
import OtpWidget from "@/components/Widgets/OtpWidget";
import ButtonWidget from "@/components/Widgets/ButtonWidget";
import RowWidget from "@/components/Widgets/RowWidget";

export default function ContentRegister() {
  const { theme } = useTheme();
  const router = useRouter();
  const {
    state,
    actions,
    handleUrl,
    clearForm,
    handleRegister,
    handleVerification,
  } = useAuthentication();

  const styles = createAuth(theme);

  const {
    username,
    emailAddress,
    password,
    code,
    loading,
    hidePassword,
    isVerification,
  } = state;
  const {
    setUsername,
    setEmailAddress,
    setPassword,
    setCode,
    setHidePassword,
  } = actions;

  const usernameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const referralRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const otpRef = useRef<OtpInputRef>(null);

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { paddingHorizontal: 20 }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Image
        source={require("@/assets/images/strx.png")}
        style={{ width: 125, height: 125 }}
      />

      <ColumnWidget style={{ width: "100%", gap: 15, paddingHorizontal: 10 }}>
        <InputWidget
          style={{ width: "100%" }}
          ref={usernameRef}
          label={"Username"}
          value={username}
          editable={!isVerification}
          onChangeText={setUsername}
          placeholder={"John Doe"}
          onSubmitEditing={() => emailRef.current?.focus()}
        />
        <InputWidget
          style={{ width: "100%" }}
          ref={emailRef}
          label={"Email"}
          value={emailAddress}
          editable={!isVerification}
          onChangeText={setEmailAddress}
          placeholder={"johndoe@gmail.com"}
          onSubmitEditing={() => referralRef.current?.focus()}
        />

        {isVerification ? (
          <OtpWidget
            ref={otpRef}
            label={"One Time Password"}
            value={code}
            onChangeText={setCode}
            onSubmitEditing={handleVerification}
          />
        ) : (
          <InputWidget
            style={{ width: "100%" }}
            ref={passwordRef}
            label={"Password"}
            value={password}
            onChangeText={setPassword}
            placeholder={"••••••"}
            secureTextEntry={hidePassword}
            setSecureTextEntry={setHidePassword}
          />
        )}
        <ButtonWidget
          isLoading={loading}
          disabled={
            isVerification
              ? code.length < 6
              : !emailAddress || !password || !username
          }
          style={{ width: "100%", marginTop: 15 }}
          content={isVerification ? "VERIFY" : "REGISTER"}
          onPress={isVerification ? handleVerification : handleRegister}
        />
        <RowWidget style={{ gap: 5 }}>
          <Text style={styles.textWhite}>Already have an account?</Text>
          <TouchableOpacity
            disabled={loading}
            onPress={() => {
              clearForm();
              router.dismiss();
            }}
          >
            <Text style={styles.textPrimary}>Sign In</Text>
          </TouchableOpacity>
        </RowWidget>
      </ColumnWidget>

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
