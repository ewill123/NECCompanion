import React, { useState, useContext } from "react";
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
  ActivityIndicator,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { supabase } from "../backend/supabase";
import uuid from "react-native-uuid";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { AuthContext } from "../context/AuthContext";
import { useNavigation, NavigationProp } from "@react-navigation/native";

type RootStackParamList = {
  SignIn: undefined;
  // Add other screens as needed
};

export default function ReportIssueScreen() {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [description, setDescription] = useState("");
  const [attachmentUri, setAttachmentUri] = useState<string | null>(null);
  const [attachmentName, setAttachmentName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.loginMessage}>
          Please log in to report an issue.
        </Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate("SignIn")}
        >
          <Text style={styles.loginButtonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const uploadAttachment = async (
    uri: string,
    fileName: string
  ): Promise<string | null> => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const uniqueFileName = `${uuid.v4()}_${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("attachments")
        .upload(uniqueFileName, blob, { upsert: false });
      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("attachments")
        .getPublicUrl(uniqueFileName);

      return data.publicUrl;
    } catch (error) {
      console.error("Attachment upload failed", error);
      return null;
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });
      if (result.type === "success") {
        setAttachmentUri(result.uri);
        setAttachmentName(result.name);
      }
    } catch (err) {
      console.error("Document picking error:", err);
      Alert.alert("Error", "Failed to pick document.");
    }
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      Alert.alert("Validation", "Please describe your issue.");
      return;
    }

    setLoading(true);

    let attachmentUrl: string | null = null;
    if (attachmentUri && attachmentName) {
      attachmentUrl = await uploadAttachment(attachmentUri, attachmentName);
      if (!attachmentUrl) {
        setLoading(false);
        Alert.alert("Error", "Failed to upload attachment.");
        return;
      }
    }

    const { error } = await supabase.from("issues").insert([
      {
        id: uuid.v4() as string,
        user_id: user.id,
        description,
        attachment_url: attachmentUrl,
        type: "report",
        status: "new",
        created_at: new Date().toISOString(),
      },
    ]);

    setLoading(false);

    if (error) {
      console.error("Insert failed:", error);
      Alert.alert("Error", "Something went wrong. Try again.");
      return;
    }

    Alert.alert("Thank You", "Your issue has been reported.");
    setDescription("");
    setAttachmentUri(null);
    setAttachmentName(null);
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
            style={styles.attachmentButton}
            onPress={pickDocument}
          >
            <Feather name="paperclip" size={20} color="#2563eb" />
            <Text style={styles.attachmentText}>
              {attachmentName ?? "Attach a file (optional)"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading && (
              <ActivityIndicator color="#fff" style={{ marginRight: 8 }} />
            )}
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
  attachmentButton: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#2563eb",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#e0e7ff",
  },
  attachmentText: {
    marginLeft: 10,
    color: "#2563eb",
    fontSize: 16,
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
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#f1f5f9",
  },
  loginMessage: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    color: "#0f172a",
  },
  loginButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 14,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});
