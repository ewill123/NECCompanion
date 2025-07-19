import React, { useEffect, useState } from "react";
import { ActivityIndicator, View, StyleSheet, Text } from "react-native";
import "./localization/i18n";
import i18n from "./localization/i18n";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AuthProvider } from "./context/AuthContext";
import { AppConfigProvider } from "./AppConfigContext";

import WelcomeStep from "./screens/onboarding/WelcomeStep";
import LanguageSelectStep from "./screens/onboarding/LanguageSelectStep";
import PermissionsStep from "./screens/onboarding/PermissionsStep";
import SignInScreen from "./screens/auth/SignInScreen";
import SignUpScreen from "./screens/auth/SignUpScreen";
import HomeScreen from "./screens/HomeScreen";
import EducationScreen from "./screens/EducationScreen";
import ReportIssueScreen from "./screens/ReportIssueScreen";
import PollingCentersScreen from "./screens/PollingCentersScreen";
import KnowCandidateScreen from "./screens/KnowCandidateScreen";

import { getSavedLanguage, isOnboardingComplete } from "./utils/storage";

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const lang = await getSavedLanguage();
        const done = await isOnboardingComplete();

        if (lang) {
          await i18n.changeLanguage(lang);
        }

        setInitialRoute(done ? "Home" : "Welcome");
      } catch (error) {
        console.error("Failed to load app settings:", error);
        setInitialRoute("Welcome");
      }
    }

    loadSettings();
  }, []);

  if (!initialRoute) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading settings...</Text>
      </View>
    );
  }

  return (
    <AppConfigProvider>
      <AuthProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={initialRoute}
            screenOptions={{ headerShown: true }}
          >
            <Stack.Screen name="Welcome" component={WelcomeStep} />
            <Stack.Screen
              name="LanguageSelect"
              component={LanguageSelectStep}
            />
            <Stack.Screen name="Permissions" component={PermissionsStep} />
            <Stack.Screen
              name="SignIn"
              component={SignInScreen}
              options={{ title: "Sign In" }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{ title: "Sign Up" }}
            />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Education" component={EducationScreen} />
            <Stack.Screen name="ReportIssue" component={ReportIssueScreen} />
            <Stack.Screen
              name="PollingCenters"
              component={PollingCentersScreen}
            />
            <Stack.Screen
              name="KnowCandidate"
              component={KnowCandidateScreen}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </AppConfigProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
