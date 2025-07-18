import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
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

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const res = await fetch("https://jsonplaceholder.typicode.com/users");
        const json = await res.json();
        const formatted: PollingCenter[] = json.map((u: any) => ({
          id: u.id,
          name: u.name,
          location: `${u.address.city}, ${u.address.street}`,
        }));
        setPollingCenters(formatted);
      } catch (error) {
        console.warn("Unable to load live demo data.", error);
        setPollingCenters([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

    fetchCenters();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    // Re-fetch data
    const fetchCenters = async () => {
      try {
        const res = await fetch("https://jsonplaceholder.typicode.com/users");
        const json = await res.json();
        const formatted: PollingCenter[] = json.map((u: any) => ({
          id: u.id,
          name: u.name,
          location: `${u.address.city}, ${u.address.street}`,
        }));
        setPollingCenters(formatted);
      } catch (error) {
        console.warn("Unable to load live demo data.", error);
        setPollingCenters([]);
      } finally {
        setRefreshing(false);
      }
    };
    fetchCenters();
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#006D77" />
        <Text style={styles.loadingText}>Loading real data...</Text>
      </View>
    );
  }

  if (!pollingCenters.length) {
    return (
      <View style={styles.centered}>
        <Text style={styles.placeholderText}>
          No data available from demo API.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={pollingCenters}
      keyExtractor={(item) => item.id.toString()}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.subtitle}>{item.location}</Text>
        </View>
      )}
      contentContainerStyle={{ padding: 20 }}
    />
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#64748B",
  },
  placeholderText: {
    fontSize: 16,
    textAlign: "center",
    color: "#64748B",
  },
  card: {
    backgroundColor: "#E0F7F4",
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
  },
  title: {
    fontWeight: "700",
    fontSize: 16,
    color: "#1E293B",
  },
  subtitle: {
    fontSize: 14,
    color: "#475569",
    marginTop: 4,
  },
});
