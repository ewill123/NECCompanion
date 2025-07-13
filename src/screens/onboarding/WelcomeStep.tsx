import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native";
import { useTranslation } from "react-i18next";
import * as Speech from "expo-speech";

const { width } = Dimensions.get("window");

export default function WelcomeStep({ navigation }: { navigation: any }) {
  const { t } = useTranslation();

  // Animation refs
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Start pulse animation (shadow opacity)
  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false, // shadowOpacity needs false
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  // Button press animation handlers
  const onPressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };
  const onPressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  // Interpolated shadow opacity from pulseAnim
  const shadowOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <View style={styles.container}>
      {/* Animated Logo Placeholder */}
      <Animated.View
        style={[
          styles.logo,
          {
            shadowOpacity,
          },
        ]}
      >
        <Text style={styles.logoText}>NEC</Text>
      </Animated.View>

      {/* Title */}
      <Text style={styles.title}>{t("welcome")}</Text>

      {/* Intro Text */}
      <Text style={styles.introText}>{t("intro")}</Text>

      {/* Read Aloud Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.speakButton}
        onPress={() => Speech.speak(t("intro"))}
        accessibilityLabel="Read introduction aloud"
      >
        <Text style={styles.speakButtonText}>
          🔊 {t("read_aloud") || "Read Aloud"}
        </Text>
      </TouchableOpacity>

      {/* Next Button with scale animation */}
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.nextButton}
          onPress={() => navigation.navigate("LanguageSelect")}
          accessibilityLabel="Go to language selection"
          onPressIn={onPressIn}
          onPressOut={onPressOut}
        >
          <Text style={styles.nextButtonText}>{t("next")}</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a", // dark navy background for modern look
    paddingHorizontal: 30,
    paddingVertical: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#2563eb", // bright blue
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 20,
    elevation: 10,
  },
  logoText: {
    color: "white",
    fontWeight: "900",
    fontSize: 48,
    letterSpacing: 6,
  },
  title: {
    fontSize: 36,
    fontWeight: "900",
    color: "#e0e7ff", // light bluish text
    textAlign: "center",
    marginBottom: 20,
  },
  introText: {
    fontSize: 18,
    color: "#a5b4fc", // subtle pastel blue
    lineHeight: 28,
    textAlign: "center",
    marginBottom: 36,
    maxWidth: width * 0.8,
  },
  speakButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 30,
    shadowColor: "#3b82f6",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 50,
  },
  speakButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
  nextButton: {
    backgroundColor: "#22c55e",
    paddingVertical: 20,
    paddingHorizontal: 60,
    borderRadius: 40,
    alignItems: "center",
    shadowColor: "#22c55e",
    shadowOpacity: 0.6,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 15,
    elevation: 12,
  },
  nextButtonText: {
    fontSize: 22,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: 1,
  },
});
