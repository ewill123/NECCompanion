import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import { useTranslation } from "react-i18next";
import { saveOnboardingComplete } from "../utils/storage";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Entypo from "react-native-vector-icons/Entypo";

export default function HomeScreen({ navigation }: { navigation: any }) {
  const { t } = useTranslation();

  const [newsIndex, setNewsIndex] = useState(0);
  const newsItems = [
    "Liberia prepares for upcoming by-election on August 15.",
    "NEC announces voter registration deadline extension.",
    "Stay safe and informed: Follow NEC official guidelines.",
  ];

  const handleNextNews = () => {
    setNewsIndex((prev) => (prev + 1) % newsItems.length);
  };

  const handleResetOnboarding = async () => {
    await saveOnboardingComplete();
    Alert.alert(
      t("reset_done_title") ?? "Setup Restarted",
      t("reset_done_message") ?? "You will be redirected to setup."
    );
    navigation.reset({ index: 0, routes: [{ name: "Welcome" }] });
  };

  const actionCards = [
    {
      id: "education",
      icon: <FontAwesome5 name="book-open" size={28} color="#a16207" />,
      label: t("education"),
      bg: "#fef3c7",
      onPress: () => navigation.navigate("Education"),
      style: {},
      textColor: "#92400e",
    },
    {
      id: "report",
      icon: <MaterialIcons name="report-problem" size={28} color="#b91c1c" />,
      label: t("report_issue"),
      bg: "#fee2e2",
      onPress: () => navigation.navigate("ReportIssue"),
      style: {
        borderWidth: 2,
        borderColor: "#b91c1c",
        shadowColor: "#b91c1c",
        shadowOpacity: 0.6,
        shadowRadius: 8,
        elevation: 10,
      },
      textColor: "#991b1b",
    },
    {
      id: "pollingCenters",
      icon: <MaterialIcons name="location-city" size={28} color="#1e40af" />,
      label: t("polling_centers") ?? "Polling Centers",
      bg: "#dbeafe",
      onPress: () => navigation.navigate("PollingCenters"),
      style: {},
      textColor: "#1e3a8a",
    },
    {
      id: "knowCandidate",
      icon: <FontAwesome5 name="user-tie" size={28} color="#047857" />,
      label: t("know_candidate") ?? "Know Your Candidate",
      bg: "#d1fae5",
      onPress: () => navigation.navigate("KnowCandidate"),
      style: {},
      textColor: "#065f46",
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      {/* Top bar with Profile icon in top-right */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Profile")}
          accessibilityRole="button"
          accessibilityLabel="Profile"
          style={styles.profileIconContainer}
        >
          <Entypo name="user" size={28} color="#1e293b" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={require("../assets/NEC.jpeg")}
          style={styles.heroImage}
          resizeMode="contain"
        />

        <Text style={styles.headerTitle}>National Elections Commission</Text>
        <Text style={styles.headerSubtitle}>Liberia Companion App</Text>

        <View style={styles.newsCard}>
          <Text style={styles.sectionTitle}>Latest NEC News</Text>
          <Text
            style={styles.newsTickerText}
            accessibilityRole="text"
            accessibilityLabel={`News update: ${newsItems[newsIndex]}`}
          >
            📰 {newsItems[newsIndex]}
          </Text>
          {newsItems.length > 1 && (
            <TouchableOpacity
              onPress={handleNextNews}
              style={styles.nextNewsButton}
              accessibilityRole="button"
              accessibilityLabel="Next news item"
            >
              <Text style={styles.nextNewsText}>Next</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.actionsRow}>
          {actionCards.map(
            ({ id, icon, label, bg, onPress, style, textColor }) => (
              <TouchableOpacity
                key={id}
                style={[styles.cardButton, { backgroundColor: bg }, style]}
                onPress={onPress}
                accessibilityRole="button"
                accessibilityLabel={label}
              >
                {icon}
                <Text
                  style={[
                    styles.cardButtonText,
                    { color: textColor },
                    id === "report" ? { fontWeight: "900" } : {},
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            )
          )}

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleResetOnboarding}
            accessibilityRole="button"
            accessibilityLabel="Restart Setup"
          >
            <MaterialIcons name="logout" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>NEC Companion App v1.0.0 © 2025</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    width: "100%",
    height: 60,
    backgroundColor: "#f8fafc",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  profileIconContainer: {
    padding: 8,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    alignItems: "center",
  },
  heroImage: {
    width: 90,
    height: 90,
    marginBottom: 16,
    borderRadius: 18,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#1e293b",
  },
  headerSubtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 30,
  },
  newsCard: {
    backgroundColor: "#e0f2fe",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    width: "100%",
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#bae6fd",
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1e40af",
    marginBottom: 8,
  },
  newsTickerText: {
    fontSize: 14,
    color: "#2563eb",
    fontWeight: "600",
  },
  nextNewsButton: {
    alignSelf: "flex-end",
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "#bae6fd",
  },
  nextNewsText: {
    fontSize: 13,
    color: "#1e40af",
    fontWeight: "700",
  },
  actionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
    rowGap: 14,
    marginBottom: 30,
  },
  cardButton: {
    width: "48%",
    aspectRatio: 1,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  cardButtonText: {
    marginTop: 10,
    fontSize: 15,
    textAlign: "center",
  },
  logoutButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 14,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#cbd5e1",
    paddingTop: 16,
    paddingBottom: 24,
  },
  footerText: {
    fontSize: 13,
    color: "#94a3b8",
  },
});
