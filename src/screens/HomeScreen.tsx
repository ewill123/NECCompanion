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
  Linking,
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

const COLORS = {
  background: "#F4F4F7",
  primary: "#0C4A6E",
  accent: "#E11D48",
  cube1: "#ffc574ff",
  cube2: "#85c8ffff",
  cube3: "#6afcacff",
  cube4: "#ffacb1ff",
  textDark: "#141e2eff",
  textSoft: "#53647dff",
  white: "#FFFFFF",
  highlight: "#112147ff",
  cardShadow: "#000000",
  whatsapp: "#25D366",
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
      ? Math.ceil((electionDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      : null;

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

  const cardScales = useRef(
    actionCards.map(() => new Animated.Value(1))
  ).current;

  useEffect(() => {
    cardScales.forEach((anim) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1.03,
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 1,
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, [cardScales]);

  useEffect(() => {
    async function fetchNews() {
      setNewsLoading(true);
      try {
        const { data, error } = await supabase
          .from("news")
          .select("id, title, description, created_at")
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (data && data.length) {
          const newsStrings = data.map(
            (item) =>
              `${item.title ?? ""}${
                item.description ? ` - ${item.description}` : ""
              }`
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
  }, []);

  const handleResetOnboarding = async () => {
    await saveOnboardingComplete();
    navigation.reset({ index: 0, routes: [{ name: "Welcome" }] });
  };

  const handleNextNews = () => {
    setNewsIndex((prev) =>
      newsItems.length ? (prev + 1) % newsItems.length : 0
    );
  };

  const handleWhatsAppContact = () => {
    Linking.openURL("https://wa.me/231880575207"); // NEC hotline number
  };

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
    <View style={[styles.container, { backgroundColor: COLORS.background }]}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleResetOnboarding}>
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
          {actionCards.map((card, index) => (
            <Animated.View
              key={card.id}
              style={{
                transform: [{ scale: cardScales[index] }],
                width: "48%",
                marginBottom: 16,
              }}
            >
              <TouchableOpacity
                onPress={card.onPress}
                activeOpacity={0.85}
                style={[styles.card, { backgroundColor: card.bg }]}
              >
                {card.icon}
                <Text style={[styles.cardText, { color: card.textColor }]}>
                  {card.label}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>NEC Companion App v2.0.0 © 2025</Text>
        </View>
      </ScrollView>

      <Animated.View
        style={[
          styles.fab,
          { backgroundColor: COLORS.whatsapp, transform: [{ translateY: -4 }] },
        ]}
      >
        <TouchableOpacity onPress={handleWhatsAppContact} activeOpacity={0.8}>
          <FontAwesome5 name="whatsapp" size={26} color={COLORS.white} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
    backgroundColor: "#0C4A6E",
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
    color: "#ffffffff",
  },
  countdownSub: {
    fontSize: 14,
    color: "#ffffffff",
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
    backgroundColor: "#42a5e6ff",
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
    aspectRatio: 1,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
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
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: COLORS.cardShadow,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
});
