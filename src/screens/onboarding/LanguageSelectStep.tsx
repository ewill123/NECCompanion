import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
  Animated,
} from "react-native";
import { useTranslation } from "react-i18next";
import i18n from "../../localization/i18n";
import { saveLanguage } from "../../utils/storage";

export default function LanguageSelectStep({
  navigation,
}: {
  navigation: any;
}) {
  const { t } = useTranslation();

  // Animated scale value for buttons
  const scaleAnimEn = useRef(new Animated.Value(1)).current;
  const scaleAnimKpelle = useRef(new Animated.Value(1)).current;

  const animatePressIn = (anim: Animated.Value) => {
    Animated.spring(anim, {
      toValue: 0.95,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const animatePressOut = (anim: Animated.Value) => {
    Animated.spring(anim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handleSelect = async (lang: string) => {
    i18n.changeLanguage(lang);
    await saveLanguage(lang);
    navigation.navigate("Permissions");
  };

  // Reusable animated button
  const LanguageButton = ({
    title,
    onPress,
    scaleAnim,
  }: {
    title: string;
    onPress: (event: GestureResponderEvent) => void;
    scaleAnim: Animated.Value;
  }) => (
    <Animated.View style={{ transform: [{ scale: scaleAnim }], width: "80%" }}>
      <TouchableOpacity
        style={styles.langButton}
        activeOpacity={0.7}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`Select language ${title}`}
        testID={`btn-select-lang-${title.toLowerCase()}`}
        onPressIn={() => animatePressIn(scaleAnim)}
        onPressOut={() => animatePressOut(scaleAnim)}
      >
        <Text style={styles.langButtonText}>{title}</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("language_prompt")}</Text>
      <Text style={styles.subTitle}>{t("language_prompt_subtitle")}</Text>

      <LanguageButton
        title={t("english")}
        onPress={() => handleSelect("en")}
        scaleAnim={scaleAnimEn}
      />
      <LanguageButton
        title={t("kpelle")}
        onPress={() => handleSelect("kpelle")}
        scaleAnim={scaleAnimKpelle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a", // dark navy for consistency
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    marginBottom: 8,
    color: "#e0e7ff", // light pastel blue
    textAlign: "center",
  },
  subTitle: {
    fontSize: 18,
    color: "#a5b4fc", // subtle pastel blue
    marginBottom: 48,
    textAlign: "center",
    lineHeight: 24,
  },
  langButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 18,
    borderRadius: 30,
    marginVertical: 12,
    shadowColor: "#2563eb",
    shadowOpacity: 0.45,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 15,
    elevation: 10,
  },
  langButtonText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 22,
    textAlign: "center",
    letterSpacing: 0.8,
  },
});
