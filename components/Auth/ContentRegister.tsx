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
  const { theme, translations } = useTheme();
  const router = useRouter();
  const {
    state,
    dispatch,
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

  const usernameRef = useRef<TextInput | null>(null);
  const emailRef = useRef<TextInput | null>(null);
  const referralRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);
  const otpRef = useRef<OtpInputRef | null>(null);

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
          label={translations.auth.register.labelOne}
          value={username}
          editable={!isVerification}
          onChangeText={(text) =>
            dispatch({ type: "SET_FIELD", field: "username", value: text })
          }
          placeholder={"John Doe"}
          onSubmitEditing={() => emailRef.current?.focus()}
        />
        <InputWidget
          style={{ width: "100%" }}
          ref={emailRef}
          label={translations.auth.register.labelTwo}
          value={emailAddress}
          editable={!isVerification}
          onChangeText={(text) =>
            dispatch({ type: "SET_FIELD", field: "emailAddress", value: text })
          }
          placeholder={"johndoe@gmail.com"}
          onSubmitEditing={() => referralRef.current?.focus()}
        />

        {isVerification ? (
          <OtpWidget
            ref={otpRef}
            label={translations.auth.register.labelFour}
            value={code}
            onChangeText={(text) =>
              dispatch({ type: "SET_FIELD", field: "code", value: text })
            }
            onSubmitEditing={handleVerification}
          />
        ) : (
          <InputWidget
            style={{ width: "100%" }}
            ref={passwordRef}
            label={translations.auth.register.labelThree}
            value={password}
            onChangeText={(text) =>
              dispatch({ type: "SET_FIELD", field: "password", value: text })
            }
            placeholder={"••••••"}
            secureTextEntry={hidePassword}
            setSecureTextEntry={() =>
              dispatch({ type: "TOGGLE_PASSWORD_VISIBILITY" })
            }
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
          content={
            isVerification
              ? `${translations.auth.register.verify}`
              : `${translations.auth.register.register}`
          }
          onPress={isVerification ? handleVerification : handleRegister}
        />

        <RowWidget style={{ gap: 5 }}>
          <Text style={styles.textWhite}>
            {translations.auth.register.guideOne}
          </Text>
          <TouchableOpacity
            disabled={loading}
            onPress={() => {
              clearForm();
              router.dismiss();
            }}
          >
            <Text style={styles.textPrimary}>
              {translations.auth.register.link}
            </Text>
          </TouchableOpacity>
        </RowWidget>
      </ColumnWidget>

      <ColumnWidget style={{ width: "100%", gap: 5, paddingHorizontal: 20 }}>
        <Text style={styles.textWhite}>
          {translations.auth.register.guideTwo}
        </Text>
        <TouchableOpacity onPress={handleUrl}>
          <Text style={styles.textPrimary}>
            {translations.auth.register.terms}
          </Text>
        </TouchableOpacity>
      </ColumnWidget>
    </KeyboardAvoidingView>
  );
}
