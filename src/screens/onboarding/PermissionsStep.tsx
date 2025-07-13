import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Animated,
} from "react-native";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { saveOnboardingComplete } from "../../utils/storage";
import { MaterialIcons } from "@expo/vector-icons";

export default function PermissionsStep({ navigation }: { navigation: any }) {
  const [hasLocationPermission, setHasLocationPermission] = useState<
    boolean | null
  >(null);
  const [hasNotificationPermission, setHasNotificationPermission] = useState<
    boolean | null
  >(null);
  const [loading, setLoading] = useState(false);

  // Animation for fade in on mount
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    setLoading(true);
    try {
      const { status: locationStatus } =
        await Location.requestForegroundPermissionsAsync();
      setHasLocationPermission(locationStatus === "granted");

      const { status: notificationStatus } =
        await Notifications.requestPermissionsAsync();
      setHasNotificationPermission(notificationStatus === "granted");

      if (locationStatus !== "granted" || notificationStatus !== "granted") {
        Alert.alert(
          "Permissions Required",
          "Please grant location and notification permissions to continue."
        );
      }
    } catch {
      Alert.alert("Error", "Failed to request permissions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = async () => {
    if (!hasLocationPermission || !hasNotificationPermission) {
      Alert.alert(
        "Permissions Missing",
        "Please allow both permissions to proceed."
      );
      return;
    }
    await saveOnboardingComplete();
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    });
  };

  const renderPermissionStatus = (granted: boolean | null, label: string) => {
    if (granted === null) {
      return (
        <View style={styles.statusRow}>
          <ActivityIndicator size="small" color="#2563eb" />
          <Text style={[styles.statusText, { color: "#94a3b8" }]}>
            {label}: Checking...
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.statusRow}>
        <MaterialIcons
          name={granted ? "check-circle" : "cancel"}
          size={26}
          color={granted ? "#10b981" : "#ef4444"}
        />
        <Text
          style={[
            styles.statusText,
            { color: granted ? "#10b981" : "#ef4444" },
          ]}
        >
          {label}: {granted ? "Granted" : "Denied"}
        </Text>
      </View>
    );
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.title}>Enable Location & Notifications</Text>

      {renderPermissionStatus(hasLocationPermission, "Location Permission")}
      {renderPermissionStatus(
        hasNotificationPermission,
        "Notification Permission"
      )}

      <TouchableOpacity
        style={[
          styles.button,
          !(hasLocationPermission && hasNotificationPermission) &&
            styles.buttonDisabled,
        ]}
        onPress={handleFinish}
        disabled={
          !(hasLocationPermission && hasNotificationPermission) || loading
        }
        accessibilityLabel="Finish onboarding and proceed"
        activeOpacity={0.85}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.buttonText}>Finish</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={requestPermissions}
        style={styles.linkButton}
        activeOpacity={0.7}
      >
        <Text style={styles.linkText}>Request Permissions Again</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a", // dark navy for app consistency
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    marginBottom: 40,
    color: "#e0e7ff", // pastel light blue
    textAlign: "center",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  statusText: {
    fontSize: 20,
    marginLeft: 14,
    fontWeight: "700",
  },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 18,
    paddingHorizontal: 100,
    borderRadius: 35,
    marginTop: 40,
    shadowColor: "#2563eb",
    shadowOpacity: 0.45,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 16,
    elevation: 12,
  },
  buttonDisabled: {
    backgroundColor: "#93c5fd",
  },
  buttonText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: 0.7,
  },
  linkButton: {
    marginTop: 30,
  },
  linkText: {
    fontSize: 18,
    color: "#2563eb",
    textDecorationLine: "underline",
    fontWeight: "700",
  },
});
