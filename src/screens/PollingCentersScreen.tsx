import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function PollingCentersScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Polling Centers</Text>
      <Text>Here you will find information about polling centers.</Text>
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
