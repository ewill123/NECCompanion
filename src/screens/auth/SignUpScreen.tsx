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

export default function SignUpScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password || !fullName || !phone) {
      Alert.alert("Validation", "Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      const userId = data.user?.id;
      if (userId) {
        const { error: profileError } = await supabase.from("appusers").insert([
          {
            id: userId,
            full_name: fullName,
            phone,
            email,
            created_at: new Date().toISOString(),
          },
        ]);
        if (profileError) {
          console.error("Profile insert error:", profileError);
          Alert.alert("Error", "Failed to save user profile.");
          setLoading(false);
          return;
        }
      }

      Alert.alert(
        "Success",
        "Account created successfully! Please check your email to confirm your account."
      );
      navigation.replace("SignIn");
    } catch (error: any) {
      Alert.alert(
        "Signup Failed",
        error.message || "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>📝 Create Your Account</Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          autoCapitalize="none"
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSignUp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <MaterialIcons name="person-add" size={20} color="#fff" />
              <Text style={styles.buttonText}>Sign Up</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
          <Text style={styles.linkText}>Already have an account? Sign in</Text>
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
