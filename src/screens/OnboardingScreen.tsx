import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function OnboardingScreen({ navigation }: any) {
  return (
    <LinearGradient
      colors={["#4c669f", "#3b5998", "#192f6a"]}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to NEC Companion 🚀</Text>
        <Text style={styles.subtitle}>
          Your all-in-one app to report issues and stay connected.
        </Text>

        {/* Placeholder for illustration */}
        <View style={styles.illustration}>
          <Text style={{ fontSize: 80 }}>📱</Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Home")} // adjust navigation
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#ddd",
    textAlign: "center",
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  illustration: {
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#ff6f61",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
    shadowColor: "#ff6f61",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
