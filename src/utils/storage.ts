import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveLanguage = async (lang: string) => {
  try {
    await AsyncStorage.setItem("userLanguage", lang);
  } catch (e) {
    console.error("Failed to save language", e);
  }
};

export const getSavedLanguage = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem("userLanguage");
  } catch (e) {
    console.error("Failed to load language", e);
    return null;
  }
};

export const saveOnboardingComplete = async () => {
  try {
    await AsyncStorage.setItem("onboardingComplete", "true");
  } catch (e) {
    console.error("Failed to save onboarding status", e);
  }
};

export const isOnboardingComplete = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem("onboardingComplete");
    return value === "true";
  } catch (e) {
    console.error("Failed to read onboarding status", e);
    return false;
  }
};
