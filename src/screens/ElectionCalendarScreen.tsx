import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import Countdown from "react-native-countdown-component";
import * as Notifications from "expo-notifications";
import { supabase } from "../backend/supabase";

type Event = {
  id: string;
  title: string;
  date: string; // ISO string, e.g. "2025-10-10T00:00:00Z"
};

export default function ElectionCalendarScreen() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Notifications.requestPermissionsAsync();
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data, error } = await supabase.from("election_events").select("*");

    if (error) {
      console.error("❌ Failed to fetch events:", error.message);
      Alert.alert("Error", "Could not load events. Please try again.");
      setLoading(false);
      return;
    }

    setEvents(data as Event[]);
    setLoading(false);
  };

  const scheduleReminder = async (event: Event) => {
    const secondsUntilReminder =
      (new Date(event.date).getTime() - Date.now() - 24 * 60 * 60 * 1000) /
      1000;

    if (secondsUntilReminder <= 0) {
      Alert.alert("Too Late", "Event is less than 24 hours away.");
      return;
    }

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `📅 ${event.title}`,
          body: `Reminder for: ${event.title}`,
        },
        trigger: {
          type: "timeInterval",
          seconds: Math.floor(secondsUntilReminder),
          repeats: false,
        } as Notifications.TimeIntervalTriggerInput,
      });

      Alert.alert("✅ Reminder Set", "You will be notified 1 day before.");
    } catch (error) {
      console.error("Notification scheduling error:", error);
      Alert.alert("Error", "Failed to schedule notification.");
    }
  };

  const renderItem = ({ item }: { item: Event }) => {
    const timeRemaining = (new Date(item.date).getTime() - Date.now()) / 1000;

    return (
      <View style={styles.card}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <Countdown until={timeRemaining} size={16} />
        <Button title="Set Reminder" onPress={() => scheduleReminder(item)} />
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
        <Text>Loading election events...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    marginBottom: 30,
    padding: 20,
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
