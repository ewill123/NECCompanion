import AsyncStorage from "@react-native-async-storage/async-storage";

const LANGUAGE_KEY = "app_language";
const ONBOARDING_COMPLETE_KEY = "onboarding_complete";

export async function getSavedLanguage(): Promise<string | null> {
  try {
    const lang = await AsyncStorage.getItem(LANGUAGE_KEY);
    return lang;
  } catch (error) {
    console.error("Error reading language from storage:", error);
    return null;
  }
}

// **Add this new function:**
export async function saveLanguage(lang: string): Promise<void> {
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, lang);
  } catch (error) {
    console.error("Error saving language to storage:", error);
  }
}

export async function isOnboardingComplete(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(ONBOARDING_COMPLETE_KEY);
    return value === "true";
  } catch (error) {
    console.error("Error reading onboarding status from storage:", error);
    return false;
  }
}

export async function saveOnboardingComplete(): Promise<void> {
  try {
    await AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, "true");
  } catch (error) {
    console.error("Error saving onboarding status:", error);
  }
}
