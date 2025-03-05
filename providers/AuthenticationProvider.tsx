// Auth/AuthenticationProvider.tsx
import React, { useReducer, useMemo, useContext, createContext } from "react";
import { Linking, Keyboard } from "react-native";

import { useRouter } from "expo-router";
import { useSSO, useSignIn, useSignUp } from "@clerk/clerk-expo";
import { handleNotifier } from "@/components/Widgets/NotificationWidget";

import type { OAuthStrategy } from "@clerk/types";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { Theme } from "@/types/settings";

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
        "Invalid Email Address",
        "Please enter a valid email format.",
        "error",
      );
      return false;
    }

    if (!PASSWORD_REGEX.test(password)) {
      handleNotifier(
        "Invalid Password",
        "Password must be at least 8 characters long, include one uppercase letter, one number, and one special character.",
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
        "Registration Success!",
        "Check your email for the verification code.",
        "success",
      );
      dispatch({ type: "SET_VERIFICATION", value: true });
    } catch (error) {
      handleNotifier(
        "Registration Failed",
        "Sorry! Account already taken. Please try again.",
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
        "Verification Failed",
        "An error occurred. Please try again.",
        "error",
      );
      console.error("Verification Error:", error);
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

      handleNotifier("Verification Success!", "Welcome to STRX!", "success");
      router.push("/(tabs)");
    } catch (error) {
      console.error("Database Write Error:", error);
      handleNotifier("Database Error", "Failed to save user data.", "error");
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
          "Sign In Success!",
          "Welcome to Tipun! Enjoy your stay.",
          "success",
        );
        await signInSetActive({ session: createdSessionId });
        dispatch({ type: "CLEAR_FORM" });
      } else {
        throw new Error("Sign In Failed");
      }
    } catch (error) {
      handleNotifier(
        "Sign In Failed!",
        "Invalid Email / Password. Please try again.",
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
