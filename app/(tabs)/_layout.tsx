// (tabs)/_layout.tsx
import { colors } from "@/styles/colors";
import { createTabsNavigator } from "@/styles/stylesNavigator";

import React from "react";
import { TouchableOpacity } from "react-native";

import { useTheme } from "@/providers/ThemeProvider";

import { CurvedBottomBar } from "react-native-curved-bottom-bar";

import ReferralScreen from "@/app/(tabs)/referral";
import HomeScreen from "@/app/(tabs)/index";
import ProfileScreen from "@/app/(tabs)/profile";

import { User, Coins, UsersFour } from "phosphor-react-native";

type TabName = "referral" | "index" | "profile";

interface TabBarProps {
  routeName: TabName;
  selectedTab: TabName;
  navigate: (route: TabName) => void;
  isCircle: boolean;
}

const ICON_MAP = {
  referral: UsersFour,
  index: Coins,
  profile: User,
} as const;

export default function TabsNavigator() {
  const { theme } = useTheme();

  const styles = createTabsNavigator(theme);

  const TabButton = ({
    routeName,
    selectedTab,
    navigate,
    isCircle = false,
  }: TabBarProps) => {
    const IconComponent = ICON_MAP[routeName];
    const weight = routeName === selectedTab ? "fill" : "bold";

    return (
      <TouchableOpacity
        style={[styles.button, styles.shadow, isCircle && styles.buttonCircle]}
        onPress={() => navigate(routeName)}
      >
        <IconComponent size={30} weight={weight} color={"#20AB7D"} />
      </TouchableOpacity>
    );
  };

  return (
    <CurvedBottomBar.Navigator
      id={"TabNavigator"}
      backBehavior={"none"}
      type={"UP"}
      width={0}
      height={70}
      borderWidth={0}
      borderColor={null}
      style={null}
      circleWidth={100}
      circlePosition={"CENTER"}
      shadowStyle={styles.shadow}
      initialRouteName={"index"}
      borderTopLeftRight={false}
      screenListeners={null}
      defaultScreenOptions={null}
      screenOptions={{ headerShown: false, gestureEnabled: false }}
      tabBar={(props: TabBarProps) => <TabButton {...props} />}
      renderCircle={(props: TabBarProps) => <TabButton {...props} isCircle />}
      bgColor={colors.light.view.secondary}
    >
      <CurvedBottomBar.Screen
        name={"profile"}
        position={"LEFT"}
        component={() => <ReferralScreen />}
      />
      <CurvedBottomBar.Screen
        name={"index"}
        position={"CENTER"}
        component={() => <HomeScreen />}
      />
      <CurvedBottomBar.Screen
        name={"profile"}
        position={"RIGHT"}
        component={() => <ProfileScreen />}
      />
    </CurvedBottomBar.Navigator>
  );
}
