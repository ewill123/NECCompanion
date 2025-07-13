import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  Linking,
  Animated,
  Dimensions,
} from "react-native";
import { useTranslation } from "react-i18next";
import { saveOnboardingComplete } from "../utils/storage";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Entypo from "react-native-vector-icons/Entypo";

const { width } = Dimensions.get("window");

export default function HomeScreen({ navigation }: { navigation: any }) {
  const { t } = useTranslation();

  const scrollX = useRef(new Animated.Value(0)).current;
  const iconScale = useRef(new Animated.Value(1)).current;

  const newsItems = [
    "Liberia prepares for upcoming by-election on August 15.",
    "NEC announces voter registration deadline extension.",
    "Stay safe and informed: Follow NEC official guidelines.",
  ];

  const newsTickerText = new Array(3)
    .fill(newsItems.join("   •   "))
    .join("   •   ");
  const tickerTextWidth = newsTickerText.length * 9;

  useEffect(() => {
    Animated.loop(
      Animated.timing(scrollX, {
        toValue: -tickerTextWidth,
        duration: 60000,
        useNativeDriver: true,
        isInteraction: false,
      })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(iconScale, {
          toValue: 1.05,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(iconScale, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [scrollX, tickerTextWidth, iconScale]);

  const handleResetOnboarding = async () => {
    await saveOnboardingComplete();
    Alert.alert(
      t("reset_done_title") ?? "Restarted",
      t("reset_done_message") ?? "Onboarding has been reset."
    );
    navigation.reset({ index: 0, routes: [{ name: "Welcome" }] });
  };

  const voterStats = [
    {
      id: "registered",
      icon: <FontAwesome5 name="users" size={28} color="#1e3a8a" />,
      value: "2,400,000",
      label: "Registered voters in Liberia (2023)",
      bg: "#e0f2fe",
    },
    {
      id: "votes_cast",
      icon: <MaterialIcons name="how-to-vote" size={28} color="#065f46" />,
      value: "1,700,000",
      label: "Total votes cast nationwide (2023)",
      bg: "#d1fae5",
    },
  ];

  const socialLinks = [
    {
      id: "website",
      icon: <Entypo name="globe" size={30} color="#2563eb" />,
      url: "https://nec-liberia.org",
      label: "NEC Website",
    },
    {
      id: "facebook",
      icon: <Entypo name="facebook" size={30} color="#2563eb" />,
      url: "https://facebook.com/NECLiberia",
      label: "Facebook",
    },
    {
      id: "twitter",
      icon: <Entypo name="twitter" size={30} color="#1DA1F2" />,
      url: "https://twitter.com/NECLiberia",
      label: "Twitter",
    },
  ];

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/NEC.jpeg")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Voter Stats with Colored Cards */}
      <View style={styles.statsRow}>
        {voterStats.map(({ id, icon, value, label, bg }) => (
          <View key={id} style={[styles.statCard, { backgroundColor: bg }]}>
            <Animated.View style={{ transform: [{ scale: iconScale }] }}>
              {icon}
            </Animated.View>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
          </View>
        ))}
      </View>

      {/* News Ticker */}
      <View style={styles.newsTickerContainer}>
        <Animated.Text
          style={[
            styles.newsTickerText,
            { transform: [{ translateX: scrollX }] },
          ]}
          numberOfLines={1}
          ellipsizeMode="clip"
        >
          {newsTickerText}
        </Animated.Text>
      </View>

      {/* Action Buttons */}
      <TouchableOpacity
        style={[styles.button, styles.educationButton]}
        onPress={() => navigation.navigate("Education")}
      >
        <FontAwesome5
          name="book-open"
          size={22}
          color="#fff"
          style={styles.buttonIcon}
        />
        <Text style={styles.buttonText}>{t("education")}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.reportButton]}
        onPress={() => navigation.navigate("ReportIssue")}
      >
        <MaterialIcons
          name="report-problem"
          size={22}
          color="#fff"
          style={styles.buttonIcon}
        />
        <Text style={styles.buttonText}>{t("report_issue")}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.resetButton]}
        onPress={handleResetOnboarding}
      >
        <Entypo
          name="warning"
          size={22}
          color="#fff"
          style={styles.buttonIcon}
        />
        <Text style={styles.buttonText}>⚠️ {t("reset_onboarding")}</Text>
      </TouchableOpacity>

      {/* Social Icons */}
      <View style={styles.socialLinksContainer}>
        {socialLinks.map(({ id, icon, url, label }) => (
          <TouchableOpacity
            key={id}
            onPress={() => Linking.openURL(url)}
            style={styles.socialIconButton}
          >
            <Animated.View style={{ transform: [{ scale: iconScale }] }}>
              {icon}
            </Animated.View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate("Support")}>
          <Text style={styles.helpButtonText}>Need Help?</Text>
        </TouchableOpacity>
        <Text style={styles.versionText}>NEC Companion App v1.0.0 © 2025</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 30,
    paddingHorizontal: 28,
    backgroundColor: "#f0f4f8",
    alignItems: "center",
    paddingTop: 110,
  },
  logoContainer: {
    position: "absolute",
    top: 40,
    left: 28,
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#2563eb",
    backgroundColor: "#fff",
    elevation: 6,
    zIndex: 20,
  },
  logo: {
    width: "100%",
    height: "100%",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 36,
  },
  statCard: {
    flex: 1,
    paddingVertical: 22,
    marginHorizontal: 10,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#1e40af",
    shadowOpacity: 0.15,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 7 },
    elevation: 6,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "900",
    color: "#1e293b",
    marginTop: 10,
    letterSpacing: 0.5,
  },
  statLabel: {
    fontSize: 13,
    color: "#475569",
    marginTop: 6,
    textAlign: "center",
    fontWeight: "600",
  },
  newsTickerContainer: {
    width: "100%",
    height: 36,
    backgroundColor: "#dbeafe",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 40,
    justifyContent: "center",
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#93c5fd",
  },
  newsTickerText: {
    fontSize: 15,
    color: "#2563eb",
    fontWeight: "700",
  },
  button: {
    flexDirection: "row",
    width: "100%",
    paddingVertical: 18,
    borderRadius: 32,
    marginVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonIcon: {
    marginRight: 12,
  },
  educationButton: {
    backgroundColor: "#22c55e",
  },
  reportButton: {
    backgroundColor: "#3b82f6",
  },
  resetButton: {
    backgroundColor: "#ef4444",
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  socialLinksContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  socialIconButton: {
    marginHorizontal: 18,
    padding: 8,
    borderRadius: 36,
    backgroundColor: "#f0f9ff",
    elevation: 5,
  },
  footer: {
    width: "100%",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#cbd5e1",
    paddingVertical: 16,
    marginBottom: 10,
  },
  helpButtonText: {
    color: "#3b82f6",
    fontWeight: "700",
    fontSize: 17,
    marginBottom: 6,
  },
  versionText: {
    fontSize: 13,
    color: "#94a3b8",
  },
});
