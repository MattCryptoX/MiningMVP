// Auth/AuthenticationProvider.tsx
import React, { useReducer, useMemo, useContext, createContext } from "react";
import { Linking, Keyboard } from "react-native";

import { useRouter } from "expo-router";
import { useTheme } from "@/providers/ThemeProvider";
import { useSSO, useSignIn, useSignUp } from "@clerk/clerk-expo";

import { handleNotifier } from "@/components/Widgets/NotificationWidget";

import { hashId } from "@/hooks/useReferral";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { Theme } from "@/types/settings";

import type { OAuthStrategy } from "@clerk/types";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const AuthenticationContext = createContext<any>(undefined);

const initialState = {
  username: "",
  emailAddress: "",
  password: "",
  code: "",
  loading: false,
  hidePassword: true,
  isVerification: false,
};

const authReducer = (state: typeof initialState, action: any) => {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_LOADING":
      return { ...state, loading: action.value };
    case "TOGGLE_PASSWORD_VISIBILITY":
      return { ...state, hidePassword: !state.hidePassword };
    case "SET_VERIFICATION":
      return { ...state, isVerification: action.value };
    case "CLEAR_FORM":
      return { ...initialState };
    default:
      return state;
  }
};

export const AuthenticationProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { translations } = useTheme();
  const { startSSOFlow } = useSSO();
  const router = useRouter();
  const {
    isLoaded: signInLoaded,
    signIn,
    setActive: signInSetActive,
  } = useSignIn();
  const {
    isLoaded: signUpLoaded,
    signUp,
    setActive: signUpSetActive,
  } = useSignUp();

  const createUser = useMutation(api.user.createUser);
  const createUserSettings = useMutation(api.userSettings.createUserSettings);

  const [state, dispatch] = useReducer(authReducer, initialState);

  const handleUrl = (url: string) => Linking.openURL(url);

  const validateInputs = (email: string, password: string) => {
    if (!EMAIL_REGEX.test(email)) {
      handleNotifier(
        `${translations.auth.notifier.invalidEmail}`,
        `${translations.auth.notifier.invalidEmailContent}`,
        "error",
      );
      return false;
    }

    if (!PASSWORD_REGEX.test(password)) {
      handleNotifier(
        `${translations.auth.notifier.invalidPassword}`,
        `${translations.auth.notifier.invalidPasswordContent}`,
        "error",
      );
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!signUpLoaded) return;
    Keyboard.dismiss();

    if (!validateInputs(state.emailAddress.trim(), state.password.trim()))
      return;

    dispatch({ type: "SET_LOADING", value: true });

    try {
      await signUp.create({
        emailAddress: state.emailAddress.trim(),
        username: state.username.trim(),
        password: state.password.trim(),
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      handleNotifier(
        `${translations.auth.notifier.successRegistration}`,
        `${translations.auth.notifier.successRegistrationContent}`,
        "success",
      );
      dispatch({ type: "SET_VERIFICATION", value: true });
    } catch (error) {
      handleNotifier(
        `${translations.auth.notifier.failedRegistration}`,
        `${translations.auth.notifier.failedRegistrationContent}`,
        "error",
      );
    } finally {
      dispatch({ type: "SET_LOADING", value: false });
    }
  };

  const handleVerification = async () => {
    if (!signUpLoaded) return;
    Keyboard.dismiss();

    dispatch({ type: "SET_LOADING", value: true });

    try {
      const { status, createdSessionId, createdUserId } =
        await signUp.attemptEmailAddressVerification({ code: state.code });

      if (status === "complete") {
        await signUpSetActive({ session: createdSessionId });
        await handleWriteToDatabase(createdUserId || "");
        dispatch({ type: "CLEAR_FORM" });
      }
    } catch (error) {
      handleNotifier(
        `${translations.auth.notifier.failedVerification}`,
        `${translations.auth.notifier.failedVerificationContent}`,
        "error",
      );
    } finally {
      dispatch({ type: "SET_LOADING", value: false });
    }
  };

  const handleWriteToDatabase = async (clerkId: string) => {
    try {
      const userPayload = {
        clerkId,
        email: state.emailAddress.trim(),
        username: state.username.trim(),
        balance: 0,
        code: hashId(clerkId),
      };

      const { data: userId } = await createUser(userPayload);
      if (!userId) throw new Error("Failed to create user");

      const userSettingsPayload = {
        userId: userId as Id<"user">,
        language: "en",
        theme: "Dark" as Theme,
      };

      const { data: userSettingsId } =
        await createUserSettings(userSettingsPayload);
      if (!userSettingsId) throw new Error("Failed to create user settings");

      handleNotifier(
        `${translations.auth.notifier.successVerification}`,
        `${translations.auth.notifier.successVerificationContent}`,
        "success",
      );
      router.push("/(tabs)");
    } catch (error) {
      console.error("Database Write Error:", error);
      handleNotifier(
        `${translations.auth.notifier.database}`,
        `${translations.auth.notifier.databaseContent}`,
        "error",
      );
    }
  };

  const handleLogin = async () => {
    if (!signInLoaded) return;
    Keyboard.dismiss();

    dispatch({ type: "SET_LOADING", value: true });

    try {
      const { status, createdSessionId } = await signIn.create({
        identifier: state.emailAddress.trim(),
        password: state.password.trim(),
      });

      if (status === "complete") {
        handleNotifier(
          `${translations.auth.notifier.successLogin}`,
          `${translations.auth.notifier.successLoginContent}`,
          "success",
        );
        await signInSetActive({ session: createdSessionId });
        dispatch({ type: "CLEAR_FORM" });
      } else {
        throw new Error("Sign In Failed");
      }
    } catch (error) {
      handleNotifier(
        `${translations.auth.notifier.failedLogin}`,
        `${translations.auth.notifier.failedLoginContent}`,
        "error",
      );
    } finally {
      dispatch({ type: "SET_LOADING", value: false });
    }
  };

  const handleSSO = async (strategy: OAuthStrategy) => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({ strategy });

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      }
    } catch (error) {
      console.error("SSO Error:", error);
    }
  };

  const clearForm = () => {
    dispatch({ type: "CLEAR_FORM" });
  };

  const contextValue = useMemo(
    () => ({
      state,
      dispatch,
      handleUrl,
      handleRegister,
      handleVerification,
      handleLogin,
      handleSSO,
      clearForm,
    }),
    [state],
  );

  return (
    <AuthenticationContext.Provider value={contextValue}>
      {children}
    </AuthenticationContext.Provider>
  );
};

export const useAuthentication = () => {
  const context = useContext(AuthenticationContext);
  if (!context) {
    throw new Error(
      "useAuthentication must be used within an AuthenticationProvider",
    );
  }
  return context;
};
