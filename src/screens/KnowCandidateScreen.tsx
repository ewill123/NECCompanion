import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from "react-native";

interface Candidate {
  id: string;
  name: string;
  location: string;
  imageUrl: string;
}

export default function KnowCandidateScreen() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCandidates = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "https://randomuser.me/api/?results=5&nat=us,gb,ca"
      );
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      const formatted: Candidate[] = data.results.map((user: any) => ({
        id: user.login.uuid,
        name: `${user.name.first} ${user.name.last}`,
        location: `${user.location.city}, ${user.location.country}`,
        imageUrl: user.picture.large,
      }));
      setCandidates(formatted);
    } catch (error) {
      console.warn("Failed to load candidates.", error);
      Alert.alert(
        "Error",
        "Failed to load candidates. Please check your internet connection."
      );
      setCandidates([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCandidates();
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#006D77" />
        <Text style={styles.loadingText}>Loading candidates...</Text>
      </View>
    );
  }

  if (candidates.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.placeholderText}>
          No candidates data available.
        </Text>
      </View>
    );
  }

  const renderCandidate = ({ item }: { item: Candidate }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() =>
        Alert.alert("Candidate Selected", `${item.name} from ${item.location}`)
      }
    >
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.location}>{item.location}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={candidates}
      keyExtractor={(item) => item.id}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      contentContainerStyle={styles.listContainer}
      renderItem={renderCandidate}
      showsVerticalScrollIndicator={false}
      ListFooterComponent={<View style={{ height: 24 }} />}
    />
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
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
  listContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#E0F7F4",
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    alignItems: "center",
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  textContainer: {
    marginLeft: 14,
    flex: 1,
  },
  name: {
    fontWeight: "700",
    fontSize: 18,
    color: "#1E293B",
  },
  location: {
    fontSize: 14,
    color: "#475569",
    marginTop: 4,
  },
});
