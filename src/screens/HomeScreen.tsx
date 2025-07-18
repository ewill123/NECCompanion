import React, { useState, useEffect, useContext, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Animated,
  Easing,
} from "react-native";
import { useTranslation } from "react-i18next";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Entypo from "react-native-vector-icons/Entypo";

import { AppConfigContext } from "../AppConfigContext";
import { saveOnboardingComplete } from "../utils/storage";
import { supabase } from "../services/supabaseClient";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  Welcome: undefined;
  LanguageSelect: undefined;
  Permissions: undefined;
  SignIn: undefined;
  SignUp: undefined;
  Home: undefined;
  Education: undefined;
  ReportIssue: undefined;
  PollingCenters: undefined;
  KnowCandidate: undefined;
  Profile: undefined;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

interface AppConfigs {
  [key: string]: string | undefined;
}

interface NewsItem {
  id: number;
  title?: string;
  description?: string;
  created_at?: string;
}

const COLORS = {
  background: "#F4F4F7", // Soft modern background
  primary: "#0C4A6E", // NEC Blue
  accent: "#E11D48", // NEC Red
  cube1: "#FDF6EC", // Light pastel orange
  cube2: "#EAF4FC", // Light pastel blue
  cube3: "#F0F9F4", // Light pastel green
  cube4: "#FFF1F2", // Light pink
  textDark: "#1E293B",
  textSoft: "#64748B",
  white: "#FFFFFF",
  highlight: "#173681ff",
  cardShadow: "#000000",
};

const mockUserName = "Emmanuel";

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { t } = useTranslation();
  const { configs, loading: configsLoading } = useContext(AppConfigContext) as {
    configs: AppConfigs;
    loading: boolean;
  };

  const [newsItems, setNewsItems] = useState<string[]>([]);
  const [newsIndex, setNewsIndex] = useState(0);
  const [newsLoading, setNewsLoading] = useState(true);

  const electionDate = configs?.election_date
    ? new Date(configs.election_date)
    : null;

  const daysLeft =
    electionDate != null
      ? Math.ceil(
          (electionDate.getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : null;

  // Animated value for FAB float
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    async function fetchNews() {
      setNewsLoading(true);
      try {
        const { data, error } = await supabase
          .from<"news", NewsItem>("news")
          .select("id, title, description, created_at")
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          const newsStrings = data.map(
            (item) =>
              (item.title ?? "") +
              (item.description ? ` - ${item.description}` : "")
          );
          setNewsItems(newsStrings);
          setNewsIndex(0);
        } else {
          setNewsItems([]);
        }
      } catch (error) {
        console.error("Error loading news:", error);
        setNewsItems([]);
      } finally {
        setNewsLoading(false);
      }
    }

    fetchNews();

    // Start FAB float animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -8,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [floatAnim]);

  const handleNextNews = () => {
    setNewsIndex((prev) =>
      newsItems.length ? (prev + 1) % newsItems.length : 0
    );
  };

  const handleResetOnboarding = async () => {
    await saveOnboardingComplete();
    navigation.reset({ index: 0, routes: [{ name: "Welcome" }] });
  };

  const actionCards = [
    {
      id: "education",
      icon: <FontAwesome5 name="book-open" size={26} color={COLORS.primary} />,
      label: t("education"),
      bg: COLORS.cube1,
      textColor: COLORS.primary,
      onPress: () => navigation.navigate("Education"),
    },
    {
      id: "report",
      icon: (
        <MaterialIcons name="report-problem" size={26} color={COLORS.accent} />
      ),
      label: t("report_issue"),
      bg: COLORS.cube4,
      textColor: COLORS.accent,
      onPress: () => navigation.navigate("ReportIssue"),
    },
    {
      id: "pollingCenters",
      icon: (
        <MaterialIcons name="location-city" size={26} color={COLORS.primary} />
      ),
      label: t("polling_centers") ?? "Polling Centers",
      bg: COLORS.cube2,
      textColor: COLORS.primary,
      onPress: () => navigation.navigate("PollingCenters"),
    },
    {
      id: "knowCandidate",
      icon: <FontAwesome5 name="user-tie" size={26} color="#15803D" />,
      label: t("know_candidate") ?? "Know Your Candidate",
      bg: COLORS.cube3,
      textColor: "#15803D",
      onPress: () => navigation.navigate("KnowCandidate"),
    },
  ];

  if (configsLoading || newsLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ marginTop: 16, color: COLORS.textSoft }}>
          Loading app...
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={handleResetOnboarding}
          accessibilityLabel="Logout"
        >
          <MaterialIcons name="logout" size={24} color={COLORS.white} />
        </TouchableOpacity>

        <View style={styles.brandContainer}>
          <Text style={styles.brandTitle}>NEC Companion</Text>
          <Text style={styles.brandSubtitle}>Empowering Voters</Text>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Entypo name="user" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.greetingRow}>
          <FontAwesome5
            name="user-circle"
            size={20}
            color={COLORS.primary}
            style={{ marginRight: 8 }}
          />
          <Text style={styles.greeting}>Hello, {mockUserName}</Text>
        </View>

        {electionDate && daysLeft !== null ? (
          <View style={styles.countdownCard}>
            <View style={styles.iconRow}>
              <FontAwesome5
                name="calendar-alt"
                size={18}
                color="#92400E"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.countdownTitle}>
                {daysLeft} Days Until By-Election
              </Text>
            </View>
            <Text style={styles.countdownSub}>
              {electionDate.toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </View>
        ) : (
          <View style={styles.countdownCard}>
            <Text style={{ color: "#92400E", fontWeight: "600" }}>
              Election date not set.
            </Text>
          </View>
        )}

        <Image
          source={require("../assets/NEC.jpeg")}
          style={styles.heroImage}
          resizeMode="contain"
        />

        <Text style={styles.motto}>Your voice. Your vote. Your power.</Text>

        <View style={styles.newsCard}>
          <View style={styles.iconRow}>
            <MaterialIcons
              name="announcement"
              size={20}
              color={COLORS.primary}
              style={{ marginRight: 6 }}
            />
            <Text style={styles.newsTitle}>Latest NEC News</Text>
          </View>
          <Text style={styles.newsText}>
            {newsItems[newsIndex] || "No news available."}
          </Text>
          {newsItems.length > 1 && (
            <TouchableOpacity
              onPress={handleNextNews}
              style={styles.nextButton}
              accessibilityLabel="Next news"
            >
              <MaterialIcons
                name="navigate-next"
                size={24}
                color={COLORS.primary}
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.grid}>
          {actionCards.map(({ id, icon, label, bg, textColor, onPress }) => (
            <TouchableOpacity
              key={id}
              onPress={onPress}
              style={[styles.card, { backgroundColor: bg }]}
            >
              {icon}
              <Text style={[styles.cardText, { color: textColor }]}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>NEC Companion App v2.0.0 © 2025</Text>
        </View>
      </ScrollView>

      {/* Floating Animated FAB */}
      <Animated.View
        style={[styles.fab, { transform: [{ translateY: floatAnim }] }]}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("ReportIssue")}
          accessibilityLabel="Report an Issue"
          activeOpacity={0.8}
        >
          <Entypo name="plus" size={26} color={COLORS.white} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    height: 70,
    paddingHorizontal: 20,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
  },
  brandContainer: {
    flex: 1,
    alignItems: "center",
  },
  brandTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: "800",
  },
  brandSubtitle: {
    fontSize: 12,
    color: COLORS.white,
    marginTop: 2,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 100,
    alignItems: "center",
  },
  greetingRow: {
    flexDirection: "row",
    alignSelf: "flex-start",
    alignItems: "center",
    marginBottom: 10,
  },
  greeting: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  countdownCard: {
    width: "100%",
    backgroundColor: "#FFF3C4",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderColor: "#FCD34D",
    borderWidth: 1,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  countdownTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#92400E",
  },
  countdownSub: {
    fontSize: 14,
    color: "#78350F",
    marginTop: 4,
  },
  heroImage: {
    width: 90,
    height: 90,
    borderRadius: 18,
    marginBottom: 12,
  },
  motto: {
    fontSize: 14,
    fontStyle: "italic",
    color: COLORS.textSoft,
    marginBottom: 24,
  },
  newsCard: {
    width: "100%",
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#FFF8E1",
    borderColor: COLORS.highlight,
    borderWidth: 1,
    marginBottom: 30,
    position: "relative",
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.primary,
  },
  newsText: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textDark,
    marginTop: 8,
    marginBottom: 8,
  },
  nextButton: {
    position: "absolute",
    top: 14,
    right: 14,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 30,
  },
  card: {
    width: "48%",
    aspectRatio: 1,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    marginBottom: 16,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  cardText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingTop: 16,
    paddingBottom: 24,
  },
  footerText: {
    fontSize: 13,
    color: COLORS.textSoft,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.accent,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: COLORS.cardShadow,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
});
