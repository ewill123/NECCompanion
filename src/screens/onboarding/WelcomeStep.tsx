import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  AccessibilityInfo,
  Platform,
  Image,
} from "react-native";
import { useTranslation } from "react-i18next";
import * as Speech from "expo-speech";

const { width } = Dimensions.get("window");

// SVG Speaker Icon (custom, professional)
import Svg, { Path } from "react-native-svg";

const SpeakerIcon = ({ color = "#1e40af", size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M5 9v6h4l5 5V4L9 9H5z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <Path
      d="M16.5 12c0-1.77-1-3.29-2.5-4.03"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <Path
      d="M16.5 12c0 1.77-1 3.29-2.5 4.03"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

// SVG Arrow Icon (next button)
const ArrowRightIcon = ({ color = "#fff", size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 18l6-6-6-6"
      stroke={color}
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

export default function WelcomeStep({ navigation }: { navigation: any }) {
  const { t } = useTranslation();

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Animate fade + slide up on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  // Handle speech with loading state and accessibility announcement
  const handleSpeak = () => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
      return;
    }
    setIsSpeaking(true);
    Speech.speak(t("intro"), {
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
    });

    if (Platform.OS === "android" || Platform.OS === "ios") {
      AccessibilityInfo.announceForAccessibility(t("intro"));
    }
  };

  // Button press animations
  const scaleAnim = useRef(new Animated.Value(1)).current;
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

  return (
    <View style={styles.outerContainer} accessible>
      {/* Background gradient + subtle abstract shape */}
      <View style={styles.backgroundShape} />

      {/* Animated content container */}
      <Animated.View
        style={[
          styles.container,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Logo Image */}
        <View
          accessible
          accessibilityLabel="NEC Logo"
          style={styles.logoContainer}
        >
          <Image
            source={require("../../assets/NEC.jpeg")}
            style={styles.logoImage}
            resizeMode="contain"
            accessible={false}
          />
        </View>

        {/* Header text */}
        <Text
          style={styles.title}
          accessibilityRole="header"
          // Removed accessibilityLevel, it's invalid in React Native
        >
          {t("welcome")}
        </Text>

        {/* Description / intro */}
        <Text style={styles.introText}>{t("intro")}</Text>

        {/* Read Aloud Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleSpeak}
          accessibilityRole="button"
          accessibilityLabel={
            isSpeaking ? "Stop reading aloud" : "Read introduction aloud"
          }
          style={[styles.speakButton, isSpeaking && styles.speakButtonActive]}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
        >
          <SpeakerIcon color="#1e40af" size={24} />
          <Text
            style={[
              styles.speakButtonText,
              isSpeaking && styles.speakButtonTextActive,
            ]}
          >
            {isSpeaking
              ? t("stop_reading") || "Stop Reading"
              : t("read_aloud") || "Read Aloud"}
          </Text>
        </TouchableOpacity>

        {/* Next Button */}
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.nextButton}
            onPress={() => navigation.navigate("LanguageSelect")}
            accessibilityRole="button"
            accessibilityLabel="Go to language selection screen"
            onPressIn={onPressIn}
            onPressOut={onPressOut}
          >
            <Text style={styles.nextButtonText}>{t("next")}</Text>
            <ArrowRightIcon color="#fff" />
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  backgroundShape: {
    position: "absolute",
    width: width * 1.5,
    height: width * 1.5,
    borderRadius: width * 0.75,
    backgroundColor: "#2563eb",
    opacity: 0.15,
    top: -width * 0.6,
    left: -width * 0.5,
    transform: [{ rotate: "45deg" }],
  },
  container: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#f8fafc",
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    shadowColor: "#2563eb",
    shadowOpacity: 0.25,
    shadowRadius: 25,
    shadowOffset: { width: 0, height: 10 },
    elevation: 15,
  },
  logoContainer: {
    width: 96,
    height: 96,
    marginBottom: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  logoImage: {
    width: 96,
    height: 96,
    borderRadius: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#1e40af",
    textAlign: "center",
    marginBottom: 12,
    fontFamily: Platform.OS === "ios" ? "HelveticaNeue-Bold" : "Roboto",
  },
  introText: {
    fontSize: 17,
    color: "#334155",
    textAlign: "center",
    lineHeight: 26,
    marginBottom: 32,
    fontFamily: Platform.OS === "ios" ? "HelveticaNeue" : "Roboto",
  },
  speakButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#dbeafe",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 32,
    shadowColor: "#93c5fd",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 10,
    marginBottom: 48,
  },
  speakButtonActive: {
    backgroundColor: "#bfdbfe",
    shadowColor: "#60a5fa",
  },
  speakButtonText: {
    color: "#1e40af",
    fontWeight: "700",
    fontSize: 18,
  },
  speakButtonTextActive: {
    color: "#1e3a8a",
  },
  nextButton: {
    flexDirection: "row",
    backgroundColor: "#2563eb",
    paddingVertical: 20,
    paddingHorizontal: 44,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    shadowColor: "#2563eb",
    shadowOpacity: 0.75,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 15,
  },
  nextButtonText: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 1,
  },
});
