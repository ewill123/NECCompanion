import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
  Alert,
} from "react-native";
import { useTranslation } from "react-i18next";
import i18n from "../../localization/i18n";
import { saveLanguage } from "../../utils/storage";
import { Picker } from "@react-native-picker/picker";

interface LanguageSelectStepProps {
  navigation: any; // You can replace with proper type if using TypeScript navigation typing
}

export default function LanguageSelectStep({
  navigation,
}: LanguageSelectStepProps) {
  const { t } = useTranslation();

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [selectedLang, setSelectedLang] = useState("en");

  const handleSelect = async () => {
    try {
      await i18n.changeLanguage(selectedLang);
      await saveLanguage(selectedLang);
      navigation.navigate("Permissions");
    } catch (error) {
      console.error("Error changing language or saving:", error);
      Alert.alert(
        t("error"),
        t("language_save_failed") || "Failed to save language."
      );
    }
  };

  const animatePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const animatePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("language_prompt")}</Text>
      <Text style={styles.subTitle}>{t("language_prompt_subtitle")}</Text>

      <View style={styles.dropdownContainer}>
        <Picker
          selectedValue={selectedLang}
          onValueChange={(itemValue) => setSelectedLang(itemValue)}
          mode="dropdown"
          style={styles.picker}
          itemStyle={styles.pickerItem}
        >
          <Picker.Item label="English" value="en" />
          <Picker.Item label="Kpelle" value="kpelle" />
          <Picker.Item label="Bassa" value="bassa" />
          <Picker.Item label="Gio" value="gio" />
          <Picker.Item label="Mano" value="mano" />
          <Picker.Item label="Krahn" value="krahn" />
          <Picker.Item label="Grebo" value="grebo" />
          <Picker.Item label="Vai" value="vai" />
          <Picker.Item label="Lorma" value="lorma" />
          <Picker.Item label="Kissi" value="kissi" />
        </Picker>
      </View>

      <Animated.View
        style={{ transform: [{ scale: scaleAnim }], width: "80%" }}
      >
        <TouchableOpacity
          style={styles.proceedButton}
          onPress={handleSelect}
          activeOpacity={0.85}
          onPressIn={animatePressIn}
          onPressOut={animatePressOut}
          accessibilityLabel={
            t("proceed_with_language") || "Proceed with selected language"
          }
        >
          <Text style={styles.proceedText}>{t("continue") || "Continue"}</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    marginBottom: 8,
    color: "#e0e7ff",
    textAlign: "center",
  },
  subTitle: {
    fontSize: 18,
    color: "#a5b4fc",
    marginBottom: 40,
    textAlign: "center",
    lineHeight: 24,
  },
  dropdownContainer: {
    width: "90%",
    backgroundColor: "#e0e7ff",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 48,
    paddingVertical: Platform.OS === "android" ? 0 : 12,
  },
  picker: {
    width: "100%",
    color: "#1e3a8a",
  },
  pickerItem: {
    fontSize: 18,
  },
  proceedButton: {
    backgroundColor: "#22c55e",
    paddingVertical: 18,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    elevation: 10,
    shadowColor: "#22c55e",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  proceedText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 20,
    letterSpacing: 1,
  },
});
