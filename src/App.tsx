import React, { useEffect, useState } from "react";
import "./localization/i18n";
import i18n from "./localization/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Screens
import WelcomeStep from "./screens/onboarding/WelcomeStep";
import LanguageSelectStep from "./screens/onboarding/LanguageSelectStep";
import PermissionsStep from "./screens/onboarding/PermissionsStep";
import HomeScreen from "./screens/HomeScreen";
import EducationScreen from "./screens/EducationScreen";
import ReportIssueScreen from "./screens/ReportIssueScreen";

// Helper functions from your utils/storage
import { getSavedLanguage, isOnboardingComplete } from "./utils/storage";

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      // *** CLEAR these for testing onboarding flow - REMOVE for production ***
      await AsyncStorage.removeItem("onboardingComplete");
      await AsyncStorage.removeItem("userLanguage");

      // Load language and onboarding status
      const lang = await getSavedLanguage();
      const done = await isOnboardingComplete();

      if (lang) {
        i18n.changeLanguage(lang);
      }

      setInitialRoute(done ? "Home" : "Welcome");
    };

    loadSettings();
  }, []);

  if (!initialRoute) {
    // Show nothing or a splash screen while loading
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: true }}
      >
        <Stack.Screen name="Welcome" component={WelcomeStep} />
        <Stack.Screen name="LanguageSelect" component={LanguageSelectStep} />
        <Stack.Screen name="Permissions" component={PermissionsStep} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Education" component={EducationScreen} />
        <Stack.Screen name="ReportIssue" component={ReportIssueScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
