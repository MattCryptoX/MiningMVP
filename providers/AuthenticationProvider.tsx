// Auth/AuthenticationProvider.tsx
import React, { useMemo, useState, useContext, createContext } from "react";
import { Linking, Keyboard } from "react-native";

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

export const AuthenticationProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { startSSOFlow } = useSSO();
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

  const [loading, setLoading] = useState<boolean>(false);
  const [hidePassword, setHidePassword] = useState<boolean>(true);
  const [isVerification, setIsVerification] = useState<boolean>(false);

  const [username, setUsername] = useState<string>("");
  const [emailAddress, setEmailAddress] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [code, setCode] = useState<string>("");

  const handleUrl = (url: string) => {
    Linking.openURL(url);
  };

  const clearForm = () => {
    setEmailAddress("");
    setUsername("");
    setPassword("");
  };

  const validateInputs = (email: string, password: string) => {
    if (!EMAIL_REGEX.test(email)) {
      handleNotifier(
        "Invalid Email Address",
        "Please enter a valid email format.",
        "error",
      );
      return { success: false };
    }

    if (!PASSWORD_REGEX.test(password)) {
      handleNotifier(
        "Invalid Password",
        "Password must be at least 8 characters long, include one uppercase letter, one number, and one special character.",
        "error",
      );
      return { success: false };
    }

    return { success: true };
  };

  const handleRegister = async () => {
    if (!signUpLoaded) return;

    Keyboard.dismiss();

    const { success } = validateInputs(emailAddress.trim(), password.trim());
    if (!success) return;

    setLoading(true);

    try {
      await signUp.create({
        emailAddress: emailAddress.trim(),
        username: username.trim(),
        password: password.trim(),
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      handleNotifier(
        "Registration Success!",
        "Please check your email for the verification code to complete registration.",
        "success",
      );

      setIsVerification(true);
    } catch (error) {
      handleNotifier(
        "Registration Failed.",
        "Sorry! Account already taken. Please try again.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async () => {
    if (!signUpLoaded) return;

    Keyboard.dismiss();
    setLoading(true);

    try {
      const { status, createdSessionId, createdUserId } =
        await signUp.attemptEmailAddressVerification({ code });

      if (status === "complete") {
        await handleWriteToDatabase(createdUserId || "");
        await signUpSetActive({ session: createdSessionId });
        clearForm();
        return;
      }
    } catch (error) {
      handleNotifier(
        "Verification Failed",
        "Sorry! An error occurred. Please try again.",
        "error",
      );
      console.error("Verification Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleWriteToDatabase = async (clerkId: string) => {
    try {
      const userPayload = {
        clerkId: clerkId || "",
        email: emailAddress.trim(),
        username: username.trim(),
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
    } catch (error) {
      console.error("Database Write Error:", error);
      handleNotifier("Database Error", "Failed to save user data.", "error");
    }
  };

  const handleLogin = async () => {
    if (!signInLoaded) return;

    Keyboard.dismiss();
    setLoading(true);

    try {
      const { status, createdSessionId } = await signIn.create({
        identifier: emailAddress.trim(),
        password: password.trim(),
      });

      if (status === "complete") {
        handleNotifier(
          "Sign In Success!",
          "Welcome to Tipun! Please enjoy your stay.",
          "success",
        );

        await signInSetActive({ session: createdSessionId });
        clearForm();
        return;
      }

      throw new Error("Sign In Failed");
    } catch (error) {
      handleNotifier(
        "Sign In Failed!",
        "Invalid Email / Password. Please try again.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSSO = async (strategy: OAuthStrategy) => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({ strategy });

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      }
    } catch (error) {}
  };

  const state = useMemo(
    () => ({
      username,
      emailAddress,
      password,
      code,
      loading,
      hidePassword,
      isVerification,
    }),
    [
      username,
      emailAddress,
      password,
      code,
      loading,
      hidePassword,
      isVerification,
    ],
  );

  const actions = useMemo(
    () => ({
      setUsername,
      setEmailAddress,
      setPassword,
      setCode,
      setLoading,
      setHidePassword,
      setIsVerification,
    }),
    [],
  );

  const contextValue = useMemo(
    () => ({
      state,
      actions,
      handleUrl,
      clearForm,
      handleRegister,
      handleVerification,
      handleLogin,
      handleSSO,
    }),
    [
      state,
      actions,
      handleUrl,
      clearForm,
      handleRegister,
      handleVerification,
      handleLogin,
      handleSSO,
    ],
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
      "useAuthentication must be used within a AuthenticationProvider",
    );
  }
  return context;
};
