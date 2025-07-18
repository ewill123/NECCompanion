import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Audio } from "expo-av";

const colors = {
  background: "#f1f5f9",
  primary: "#004aad",
  secondary: "#0066ff",
  success: "#1abc9c",
  fail: "#e74c3c",
  boxBg: "#ffffff",
  boxSelected: "#d0e1ff",
  textDark: "#222",
  textSoft: "#475569",
};

const candidates = [
  "Alice Johnson",
  "Bob Smith",
  "Carol Lee",
  "David Brown",
  "Eva Green",
];

type MarkType = "Thumbprint" | "X" | "Check";

const voterEducationTopics = [
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
4. Mark your preferred candidate with a thumbprint, X, or check mark
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
- Use a single thumbprint, X, or check mark
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

export default function EducationScreen() {
  const [selectedCandidates, setSelectedCandidates] = useState<number[]>([]);
  const [selectedMark, setSelectedMark] = useState<MarkType | null>(null);
  const [voteResult, setVoteResult] = useState<{
    status: "pass" | "fail" | null;
    message: string | null;
  }>({ status: null, message: null });

  // Animated values for each candidate box
  const animations = useRef(
    candidates.map(() => new Animated.Value(1))
  ).current;

  // Load sounds once
  const soundObjects = useRef({
    success: new Audio.Sound(),
    fail: new Audio.Sound(),
  }).current;

  // Load sounds on mount
  React.useEffect(() => {
    async function loadSounds() {
      try {
        await soundObjects.success.loadAsync(
          require("../assets/sounds/success.wav")
        );
        await soundObjects.fail.loadAsync(require("../assets/sounds/fail.wav"));
      } catch (e) {
        console.warn("Sound loading failed", e);
      }
    }
    loadSounds();
    return () => {
      // Unload sounds on unmount
      soundObjects.success.unloadAsync();
      soundObjects.fail.unloadAsync();
    };
  }, []);

  const playSound = async (type: "success" | "fail") => {
    try {
      await soundObjects[type].replayAsync();
    } catch (e) {
      // ignore
    }
  };

  // Animate press-in and out on candidate box
  const animatePressIn = (index: number) => {
    Animated.timing(animations[index], {
      toValue: 0.9,
      duration: 100,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start();
  };

  const animatePressOut = (index: number) => {
    Animated.timing(animations[index], {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start();
  };

  // Toggle candidate mark on/off
  const toggleCandidateMark = (index: number) => {
    if (!selectedMark) {
      alert("Please select a mark type first.");
      return;
    }
    setVoteResult({ status: null, message: null });
    if (selectedCandidates.includes(index)) {
      setSelectedCandidates(selectedCandidates.filter((i) => i !== index));
    } else {
      setSelectedCandidates([...selectedCandidates, index]);
    }
  };

  // Submit vote: pass if exactly one candidate marked; else fail
  const submitVote = () => {
    if (!selectedMark) {
      setVoteResult({
        status: "fail",
        message: "Select a mark type before voting.",
      });
      playSound("fail");
      return;
    }
    if (selectedCandidates.length === 0) {
      setVoteResult({
        status: "fail",
        message: "You must mark at least one candidate.",
      });
      playSound("fail");
      return;
    }
    if (selectedCandidates.length > 1) {
      setVoteResult({
        status: "fail",
        message:
          "You marked multiple candidates. Only one candidate can be marked. You failed!",
      });
      playSound("fail");
      return;
    }
    setVoteResult({ status: "pass", message: "You voted correctly! 🎉" });
    playSound("success");
  };

  const resetGame = () => {
    setSelectedCandidates([]);
    setSelectedMark(null);
    setVoteResult({ status: null, message: null });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 20 }}
    >
      {/* Voting Practice Game Card */}
      <View style={styles.card}>
        <Text style={styles.header}>Voting Practice Game</Text>

        <Text style={styles.subHeader}>Select Mark Type</Text>
        <View style={styles.markSelectorContainer}>
          {(["Thumbprint", "X", "Check"] as MarkType[]).map((mark) => (
            <TouchableOpacity
              key={mark}
              style={[
                styles.markButton,
                selectedMark === mark && { backgroundColor: colors.primary },
              ]}
              onPress={() => {
                setSelectedMark(mark);
                setSelectedCandidates([]);
                setVoteResult({ status: null, message: null });
              }}
              accessibilityLabel={`Select mark type: ${mark}`}
            >
              <Text
                style={[
                  styles.markButtonText,
                  selectedMark === mark && { color: colors.background },
                ]}
              >
                {mark}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.subHeader}>
          Select Candidate(s) & Tap Box to Mark
        </Text>
        <View style={styles.candidatesContainer}>
          {candidates.map((name, index) => {
            const isSelected = selectedCandidates.includes(index);
            return (
              <Animated.View
                key={index}
                style={[
                  styles.candidateBox,
                  isSelected && {
                    borderColor: colors.primary,
                    borderWidth: 3,
                    backgroundColor: colors.boxSelected,
                  },
                  { transform: [{ scale: animations[index] }] },
                ]}
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPressIn={() => animatePressIn(index)}
                  onPressOut={() => animatePressOut(index)}
                  onPress={() => toggleCandidateMark(index)}
                  accessibilityLabel={`Candidate: ${name}`}
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.candidateName}>{name}</Text>
                  {isSelected && selectedMark && (
                    <View style={styles.markIcon}>
                      {selectedMark === "Thumbprint" && (
                        <FontAwesome5
                          name="fingerprint"
                          size={40}
                          color={colors.primary}
                        />
                      )}
                      {selectedMark === "X" && (
                        <Text style={styles.markSymbol}>X</Text>
                      )}
                      {selectedMark === "Check" && (
                        <FontAwesome5
                          name="check"
                          size={40}
                          color={colors.primary}
                        />
                      )}
                    </View>
                  )}
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        <View style={{ marginTop: 10 }}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              voteResult.status === "pass" && {
                backgroundColor: colors.success,
              },
              voteResult.status === "fail" && { backgroundColor: colors.fail },
            ]}
            onPress={submitVote}
            disabled={voteResult.status === "pass"}
            accessibilityLabel="Submit your vote"
          >
            <Text style={styles.submitButtonText}>
              {voteResult.status === null
                ? "Submit Vote"
                : voteResult.status === "pass"
                ? "You Passed! 🎉"
                : "Failed! Try Again"}
            </Text>
          </TouchableOpacity>

          {voteResult.status && (
            <Text
              style={[
                styles.message,
                voteResult.status === "pass"
                  ? styles.successMsg
                  : styles.failMsg,
              ]}
            >
              {voteResult.message}
            </Text>
          )}

          {voteResult.status && (
            <TouchableOpacity
              style={styles.resetButton}
              onPress={resetGame}
              accessibilityLabel="Reset game"
            >
              <Text style={styles.resetButtonText}>Try Again</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Voter Education Card */}
      <View style={styles.educationCard}>
        <Text style={styles.header}>Voter Education</Text>
        <Text style={styles.intro}>
          Be informed and ready. Learn everything about voting, your rights, and
          Liberia’s elections.
        </Text>

        {voterEducationTopics.map((topic, index) => (
          <View key={index} style={styles.educationTopic}>
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons
                name={topic.icon}
                size={24}
                color={colors.primary}
              />
              <Text style={styles.cardTitle}>{topic.title}</Text>
            </View>
            <Text style={styles.cardBrief}>{topic.brief}</Text>
            <Text style={styles.cardDetails}>{topic.details}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  card: {
    backgroundColor: colors.boxBg,
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  educationCard: {
    backgroundColor: colors.boxBg,
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  header: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.primary,
    marginBottom: 16,
    textAlign: "center",
  },
  intro: {
    fontSize: 16,
    color: colors.textSoft,
    marginBottom: 20,
    textAlign: "center",
    lineHeight: 22,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    color: colors.primary,
    textAlign: "center",
  },
  markSelectorContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 18,
  },
  markButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: "transparent",
    minWidth: 90,
  },
  markButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primary,
    textAlign: "center",
  },
  candidatesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  candidateBox: {
    width: "30%",
    aspectRatio: 1,
    backgroundColor: colors.background,
    borderRadius: 12,
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
  },
  candidateName: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textDark,
    textAlign: "center",
  },
  markIcon: {
    marginTop: 8,
  },
  markSymbol: {
    fontSize: 40,
    fontWeight: "900",
    color: colors.primary,
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 24,
    marginHorizontal: 40,
    marginBottom: 12,
    elevation: 4,
  },
  submitButtonText: {
    color: colors.boxBg,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 12,
    marginHorizontal: 20,
  },
  successMsg: {
    color: colors.success,
  },
  failMsg: {
    color: colors.fail,
  },
  resetButton: {
    alignSelf: "center",
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.secondary,
    marginBottom: 20,
  },
  resetButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  educationTopic: {
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.primary,
    marginLeft: 10,
  },
  cardBrief: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 6,
    color: colors.textDark,
  },
  cardDetails: {
    fontSize: 14,
    color: colors.textSoft,
    lineHeight: 20,
  },
});
