import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { supabase } from "../../backend/supabase";
import { MaterialIcons } from "@expo/vector-icons";

export default function SignInScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Validation", "Please enter email and password.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      Alert.alert("Login Failed", error.message);
      return;
    }

    Alert.alert("Success", "Logged in successfully");
    navigation.replace("Home"); // Navigate to your main app screen
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>🔐 Sign In</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          textContentType="emailAddress"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          textContentType="password"
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSignIn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <MaterialIcons name="login" size={20} color="#fff" />
              <Text style={styles.buttonText}>Sign In</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.linkText}>Don’t have an account? Sign up</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: "#f1f5f9",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#1f2937",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    borderColor: "#cbd5e1",
    borderWidth: 1,
  },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: "#93c5fd",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  linkText: {
    textAlign: "center",
    color: "#2563eb",
    fontSize: 15,
    marginTop: 10,
  },
});
