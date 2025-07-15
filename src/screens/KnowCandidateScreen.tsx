import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function KnowCandidateScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Know Your Candidate</Text>
      <Text>
        Explore information about candidates in the upcoming elections.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 16 },
});
