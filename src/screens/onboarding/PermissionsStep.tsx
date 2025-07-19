import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Animated,
  Platform,
} from "react-native";
import * as Location from "expo-location";
import { saveOnboardingComplete } from "../../utils/storage";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";

export default function PermissionsStep({ navigation }: { navigation: any }) {
  const [hasLocationPermission, setHasLocationPermission] = useState<
    boolean | null
  >(null);
  const [loading, setLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
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

      if (locationStatus !== "granted") {
        Alert.alert(
          "Location Permission Required",
          "Please allow location access to continue."
        );
      }
    } catch (err) {
      Alert.alert("Error", "Unable to request location permission. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = async () => {
    if (!hasLocationPermission) {
      Alert.alert(
        "Permission Required",
        "You must allow location access to continue."
      );
      return;
    }

    await saveOnboardingComplete();
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    });
  };

  const renderPermissionStatus = (
    granted: boolean | null,
    label: string,
    icon: keyof typeof Ionicons.glyphMap
  ) => (
    <View style={styles.statusRow}>
      {granted === null ? (
        <ActivityIndicator size="small" color="#60a5fa" />
      ) : (
        <Ionicons
          name={granted ? "checkmark-circle" : "close-circle"}
          size={26}
          color={granted ? "#10b981" : "#ef4444"}
        />
      )}
      <Text
        style={[
          styles.statusText,
          {
            color:
              granted === null ? "#94a3b8" : granted ? "#10b981" : "#ef4444",
          },
        ]}
      >
        {label}:{" "}
        {granted === null ? "Checking..." : granted ? "Granted" : "Denied"}
      </Text>
    </View>
  );

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.title}>Location Permission</Text>
      <Text style={styles.subTitle}>
        We need your location to show relevant election info.
      </Text>

      {renderPermissionStatus(
        hasLocationPermission,
        "Location",
        "location-outline"
      )}

      <TouchableOpacity
        style={[
          styles.continueButton,
          !hasLocationPermission && styles.buttonDisabled,
        ]}
        onPress={handleFinish}
        disabled={!hasLocationPermission || loading}
        activeOpacity={0.85}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.continueButtonText}>Finish</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={requestPermissions}
        style={styles.secondaryButton}
        activeOpacity={0.8}
      >
        <MaterialIcons name="refresh" size={20} color="#2563eb" />
        <Text style={styles.secondaryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    color: "#e0e7ff",
    textAlign: "center",
    marginBottom: 12,
  },
  subTitle: {
    fontSize: 16,
    color: "#cbd5e1",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
    gap: 10,
  },
  statusText: {
    fontSize: 18,
    fontWeight: "600",
  },
  continueButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginTop: 40,
    shadowColor: "#2563eb",
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },
  buttonDisabled: {
    backgroundColor: "#93c5fd",
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 24,
  },
  secondaryButtonText: {
    color: "#2563eb",
    fontWeight: "700",
    fontSize: 16,
  },
});
