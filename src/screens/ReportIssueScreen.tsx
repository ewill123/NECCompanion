import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { supabase } from "../backend/supabase";
import uuid from "react-native-uuid";
import { MaterialIcons, Feather } from "@expo/vector-icons";

export default function ReportIssueScreen() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !phone || !email || !description) {
      Alert.alert("Validation", "Please complete all fields.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("issues").insert([
      {
        id: uuid.v4() as string,
        name,
        phone,
        email,
        description,
        type: "report",
      },
    ]);

    setLoading(false);

    if (error) {
      console.error("Insert failed:", error);
      Alert.alert("Error", "Something went wrong. Try again.");
      return;
    }

    Alert.alert("Thank You", "Your issue has been reported.");
    setName("");
    setPhone("");
    setEmail("");
    setDescription("");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.title}>📢 Report an Issue</Text>

          <View style={styles.inputGroup}>
            <Feather name="user" size={18} color="#2563eb" />
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Full Name"
              placeholderTextColor="#94a3b8"
              returnKeyType="next"
            />
          </View>

          <View style={styles.inputGroup}>
            <Feather name="phone" size={18} color="#2563eb" />
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Phone Number"
              placeholderTextColor="#94a3b8"
              keyboardType="phone-pad"
              returnKeyType="next"
            />
          </View>

          <View style={styles.inputGroup}>
            <Feather name="mail" size={18} color="#2563eb" />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Email Address"
              placeholderTextColor="#94a3b8"
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
            />
          </View>

          <View style={styles.inputGroup}>
            <Feather name="file-text" size={18} color="#2563eb" />
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe your issue..."
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={4}
              returnKeyType="done"
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <MaterialIcons name="send" size={20} color="#fff" />
            <Text style={styles.buttonText}>
              {loading ? "Submitting..." : "Submit Report"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#f1f5f9",
    flexGrow: 1,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 20,
    textAlign: "center",
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#d1d5db",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 14 : 10,
    marginBottom: 16,
    backgroundColor: "#f9fafb",
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#111827",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#2563eb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: "#93c5fd",
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
});
