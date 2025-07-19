import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
} from "react-native";

interface PollingCenter {
  id: number;
  name: string;
  location: string;
}

export default function PollingCentersScreen() {
  const [pollingCenters, setPollingCenters] = useState<PollingCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCenters = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/users");
      if (!res.ok) throw new Error("Network response was not ok");

      const json: any[] = await res.json();
      const formatted: PollingCenter[] = json.map((u) => ({
        id: u.id,
        name: u.name,
        location: `${u.address.city}, ${u.address.street}`,
      }));
      setPollingCenters(formatted);
    } catch (err: any) {
      console.warn("Unable to load live demo data.", err);
      setPollingCenters([]);
      setError("Failed to load polling centers.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchCenters();
  }, [fetchCenters]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCenters();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading polling centers...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <Text onPress={onRefresh} style={styles.retryText}>
          Tap to retry
        </Text>
      </SafeAreaView>
    );
  }

  if (!pollingCenters.length) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.placeholderText}>No polling centers found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={pollingCenters}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
          />
        }
        renderItem={({ item }) => (
          <View
            style={styles.card}
            accessible={true}
            accessibilityLabel={`${item.name}, located at ${item.location}`}
          >
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.subtitle}>{item.location}</Text>
          </View>
        )}
        contentContainerStyle={{ padding: 20 }}
      />
    </SafeAreaView>
  );
}

const COLORS = {
  primary: "#006D77",
  background: "#E0F7F4",
  textPrimary: "#1E293B",
  textSecondary: "#475569",
  placeholder: "#64748B",
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.placeholder,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    marginBottom: 8,
    textAlign: "center",
  },
  retryText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "600",
    textDecorationLine: "underline",
    textAlign: "center",
  },
  placeholderText: {
    fontSize: 16,
    textAlign: "center",
    color: COLORS.placeholder,
  },
  card: {
    backgroundColor: COLORS.background,
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
  },
  title: {
    fontWeight: "700",
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
});
