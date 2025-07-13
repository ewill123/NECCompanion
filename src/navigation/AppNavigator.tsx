import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Import screens...
import WelcomeStep from "../screens/onboarding/WelcomeStep";
import LanguageSelectStep from "../screens/onboarding/LanguageSelectStep";
import PermissionsStep from "../screens/onboarding/PermissionsStep";
import HomeScreen from "../screens/HomeScreen";
import EducationScreen from "../screens/EducationScreen";
import ReportIssueScreen from "../screens/ReportIssueScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator({
  initialRouteName,
}: {
  initialRouteName: string;
}) {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRouteName}
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
