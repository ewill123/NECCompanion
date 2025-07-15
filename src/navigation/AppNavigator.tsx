import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import WelcomeStep from "../screens/onboarding/WelcomeStep";
import LanguageSelectStep from "../screens/onboarding/LanguageSelectStep";
import PermissionsStep from "../screens/onboarding/PermissionsStep";
import HomeScreen from "../screens/HomeScreen";
import EducationScreen from "../screens/EducationScreen";
import ReportIssueScreen from "../screens/ReportIssueScreen";
import PollingCentersScreen from "../screens/PollingCentersScreen";
import KnowCandidateScreen from "../screens/KnowCandidateScreen";

import SignInScreen from "../screens/auth/SignInScreen";
import SignUpScreen from "../screens/auth/SignUpScreen";

import { AuthContext } from "../context/AuthContext";

const Stack = createNativeStackNavigator();

export default function AppNavigator({
  initialRouteName,
}: {
  initialRouteName: string;
}) {
  const { user } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{ headerShown: true }}
      >
        {/* Public onboarding screens */}
        <Stack.Screen name="Welcome" component={WelcomeStep} />
        <Stack.Screen name="LanguageSelect" component={LanguageSelectStep} />
        <Stack.Screen name="Permissions" component={PermissionsStep} />

        {/* Authentication screens */}
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

        {/* Main app screens */}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Education" component={EducationScreen} />
        <Stack.Screen name="ReportIssue" component={ReportIssueScreen} />
        <Stack.Screen name="PollingCenters" component={PollingCentersScreen} />
        <Stack.Screen name="KnowCandidate" component={KnowCandidateScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
