// ✅ MULTI-MODE ELECTION GAMES — Modern UI 2025
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
  Platform,
  Dimensions,
} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ConfettiCannon from "react-native-confetti-cannon";
import { Audio } from "expo-av";

const colors = {
  background: "#F9FAFB",
  primary: "#2563EB",
  secondary: "#4F46E5",
  success: "#10B981",
  fail: "#EF4444",
  card: "#FFFFFF",
  text: "#111827",
  textMuted: "#6B7280",
};

const gameModes = ["Trivia Quiz", "Ballot Sort", "Election Timeline"];

const triviaQuestions = [
  {
    question: "Who organizes elections in Liberia?",
    options: ["UN", "Police", "NEC", "Senate"],
    answerIndex: 2,
  },
  {
    question: "What is a valid mark on a ballot?",
    options: ["Smiley", "Checkmark", "Initials", "Signature"],
    answerIndex: 1,
  },
  {
    question: "What should you bring on election day?",
    options: ["Passport", "Birth Certificate", "Voter ID", "Friend"],
    answerIndex: 2,
  },
  {
    question: "How many candidates can you vote for on a ballot?",
    options: ["As many as you want", "Only one", "Two", "None"],
    answerIndex: 1,
  },
];

export default function EducationScreen() {
  const [mode, setMode] = useState("Trivia Quiz");
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showCorrect, setShowCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [timer, setTimer] = useState(15);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const soundObjects = useRef({
    success: new Audio.Sound(),
    fail: new Audio.Sound(),
  }).current;

  useEffect(() => {
    (async () => {
      try {
        await soundObjects.success.loadAsync(
          require("../assets/sounds/success.wav")
        );
        await soundObjects.fail.loadAsync(require("../assets/sounds/fail.wav"));
      } catch (e) {
        console.warn("Sound error", e);
      }
    })();
    return () => {
      soundObjects.success.unloadAsync();
      soundObjects.fail.unloadAsync();
    };
  }, []);

  useEffect(() => {
    if (mode === "Trivia Quiz" && !showCelebration) {
      if (timerRef.current) clearInterval(timerRef.current);
      setTimer(15);
      timerRef.current = setInterval(() => {
        setTimer((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current!);
            handleAnswer(-1);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current!);
  }, [currentQ, mode]);

  const playSound = async (type: "success" | "fail") => {
    try {
      await soundObjects[type].replayAsync();
    } catch (e) {
      console.warn("Sound failed", e);
    }
  };

  const handleAnswer = (index: number) => {
    if (selected !== null) return;
    const correct = index === triviaQuestions[currentQ].answerIndex;
    setSelected(index);
    setShowCorrect(true);
    if (correct) setScore((s) => s + 1);
    playSound(correct ? "success" : "fail");
    clearInterval(timerRef.current!);
    setTimeout(() => {
      setSelected(null);
      setShowCorrect(false);
      if (currentQ + 1 >= triviaQuestions.length) {
        setShowCelebration(true);
      } else {
        setCurrentQ((c) => c + 1);
      }
    }, 1500);
  };

  const resetGame = () => {
    setCurrentQ(0);
    setScore(0);
    setSelected(null);
    setShowCelebration(false);
    setShowCorrect(false);
    setTimer(15);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 20 }}
    >
      <Text style={styles.title}>Choose an Election Game</Text>
      <View style={styles.modeRow}>
        {gameModes.map((g) => (
          <TouchableOpacity
            key={g}
            style={[styles.modeBtn, mode === g && styles.activeMode]}
            onPress={() => {
              setMode(g);
              resetGame();
            }}
          >
            <Text style={[styles.modeText, mode === g && { color: "#fff" }]}>
              {g}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {mode === "Trivia Quiz" && (
        <View style={styles.quizBox}>
          <Text style={styles.question}>
            {triviaQuestions[currentQ].question}
          </Text>
          <Text style={styles.timer}>{timer}s</Text>
          {triviaQuestions[currentQ].options.map((opt, i) => {
            const isCorrect = i === triviaQuestions[currentQ].answerIndex;
            const isWrong = i === selected && !isCorrect;
            return (
              <TouchableOpacity
                key={i}
                style={[
                  styles.option,
                  selected !== null &&
                    (isCorrect ? styles.correct : isWrong ? styles.wrong : {}),
                ]}
                onPress={() => handleAnswer(i)}
              >
                <Text style={styles.optionText}>{opt}</Text>
              </TouchableOpacity>
            );
          })}
          <Text style={styles.score}>Score: {score}</Text>
        </View>
      )}

      {showCelebration && (
        <View style={{ alignItems: "center", marginTop: 20 }}>
          <ConfettiCannon
            count={100}
            origin={{ x: Dimensions.get("window").width / 2, y: -20 }}
          />
          <Text style={styles.congrats}>
            Game Over! You scored {score} / {triviaQuestions.length}
          </Text>
          <TouchableOpacity style={styles.playAgainBtn} onPress={resetGame}>
            <Text style={styles.playAgainText}>Play Again</Text>
          </TouchableOpacity>
        </View>
      )}

      {mode === "Ballot Sort" && (
        <View style={styles.quizBox}>
          <Text style={styles.question}>
            Sort these items based on whether they belong on a real ballot:
          </Text>
          {[
            "Candidate Name",
            "Photo",
            "Party Logo",
            "Social Security Number",
          ].map((item, i) => (
            <TouchableOpacity key={i} style={styles.option}>
              <Text style={styles.optionText}>{item}</Text>
            </TouchableOpacity>
          ))}
          <Text style={styles.textMuted}>Tap an item to sort it.</Text>
        </View>
      )}

      {mode === "Election Timeline" && (
        <View style={styles.quizBox}>
          <Text style={styles.question}>
            Put these election events in order:
          </Text>
          {["Get Voter ID", "Register", "Vote", "Check Results"].map(
            (item, i) => (
              <TouchableOpacity key={i} style={styles.option}>
                <Text style={styles.optionText}>{item}</Text>
              </TouchableOpacity>
            )
          )}
          <Text style={styles.textMuted}>Tap to rearrange the timeline.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.primary,
    marginBottom: 16,
  },
  modeRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  modeBtn: {
    borderWidth: 1.5,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderColor: colors.primary,
  },
  activeMode: { backgroundColor: colors.primary },
  modeText: { color: colors.primary, fontWeight: "600" },
  quizBox: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  question: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    color: colors.text,
  },
  timer: {
    fontSize: 14,
    textAlign: "right",
    marginBottom: 12,
    color: colors.textMuted,
  },
  option: {
    backgroundColor: "#E5E7EB",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  correct: { backgroundColor: "#D1FAE5" },
  wrong: { backgroundColor: "#FECACA" },
  optionText: { fontSize: 16, fontWeight: "600" },
  score: {
    marginTop: 10,
    textAlign: "center",
    fontWeight: "700",
    color: colors.secondary,
  },
  congrats: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    color: colors.success,
    marginTop: 30,
  },
  playAgainBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    marginTop: 20,
  },
  playAgainText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  textMuted: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: "center",
    marginTop: 12,
  },
});
