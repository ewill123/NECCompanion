import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  Animated,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

// Enable LayoutAnimation for Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const colors = [
  "#e0f2fe", // Light blue
  "#dcfce7", // Light green
  "#fef9c3", // Light yellow
  "#fee2e2", // Light red
  "#ede9fe", // Light purple
];

export default function EducationScreen() {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const toggleExpand = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedCard(expandedCard === index ? null : index);
  };

  const topics = [
    {
      icon: "account-check",
      title: "Voter Rights",
      brief: "Learn about your fundamental rights as a Liberian voter.",
      details: `As a Liberian citizen, you have the right to:
- Register and vote in public elections
- Vote freely without intimidation or discrimination
- Request assistance when needed
- Access accurate electoral information

These rights are protected by the Liberian Constitution and enforced by the NEC.`,
    },
    {
      icon: "vote",
      title: "How to Vote",
      brief: "Understand the step-by-step voting process.",
      details: `Steps to vote:
1. Arrive with your voter ID at the polling station
2. Your name is checked in the registration roll
3. Receive your ballot paper
4. Mark your preferred candidate with a thumbprint
5. Place your ballot in the box and ink your finger

Voting is private and secure.`,
    },
    {
      icon: "lightbulb-on-outline",
      title: "Election Tips",
      brief: "Stay safe and informed throughout the election.",
      details: `Helpful tips:
- Know your polling center location
- Bring valid voter ID
- Don’t share who you voted for
- Report any issues to NEC staff
- Stay peaceful and informed

Your vote is powerful.`,
    },
    {
      icon: "ballot",
      title: "How Ballots Work",
      brief: "Understand how to properly mark and submit a ballot.",
      details: `Ballots contain:
- Candidate names, symbols, and photos
- A space for thumbprint voting

Instructions:
- Use a single thumbprint
- Avoid overlapping boxes
- Fold your ballot neatly
- Submit it to the ballot box

Improper ballots may be rejected.`,
    },
    {
      icon: "bank-outline",
      title: "Role of NEC",
      brief: "What the National Elections Commission is responsible for.",
      details: `NEC’s role includes:
- Organizing national and local elections
- Educating citizens about the voting process
- Verifying election results
- Managing disputes and complaints
- Ensuring elections are fair, free, and credible`,
    },
  ];

  return (
    <Animated.ScrollView
      style={{ opacity: fadeAnim }}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.header}>Voter Education</Text>
      <Text style={styles.intro}>
        Be informed and ready. Learn everything about voting, your rights, and
        Liberia’s elections.
      </Text>

      {topics.map((topic, index) => {
        const isExpanded = expandedCard === index;
        const cardColor = colors[index % colors.length];

        return (
          <TouchableOpacity
            key={index}
            onPress={() => toggleExpand(index)}
            activeOpacity={0.9}
            accessibilityLabel={`Card: ${topic.title}`}
          >
            <Animated.View
              style={[styles.card, { backgroundColor: cardColor }]}
            >
              <View style={styles.cardHeader}>
                <MaterialCommunityIcons
                  name={topic.icon}
                  size={26}
                  color="#1e40af"
                />
                <Text style={styles.cardTitle}>{topic.title}</Text>
              </View>
              <Text style={styles.cardBrief}>{topic.brief}</Text>
              {isExpanded && (
                <Text style={styles.cardDetails}>{topic.details}</Text>
              )}
              <Text style={styles.expandHint}>
                {isExpanded ? "Tap to collapse ▲" : "Tap to expand ▼"}
              </Text>
            </Animated.View>
          </TouchableOpacity>
        );
      })}
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 60,
    backgroundColor: "#f1f5f9",
  },
  header: {
    fontSize: 30,
    fontWeight: "800",
    textAlign: "center",
    color: "#0f172a",
    marginBottom: 10,
  },
  intro: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#475569",
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  card: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 10,
    color: "#1e293b",
  },
  cardBrief: {
    fontSize: 15,
    color: "#334155",
    marginBottom: 6,
  },
  cardDetails: {
    fontSize: 15,
    color: "#1f2937",
    marginTop: 8,
    lineHeight: 22,
  },
  expandHint: {
    fontSize: 13,
    color: "#475569",
    textAlign: "right",
    marginTop: 8,
  },
});
