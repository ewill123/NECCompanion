import "dotenv/config";

export default {
  expo: {
    name: "NECCompanion",
    slug: "neccompanion",
    version: "2.0.0", // 🔄 Version bumped for v2 release
    sdkVersion: "53.0.0",
    plugins: ["expo-localization"],
    android: {
      package: "com.emspire.neccompanion",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
    },
    ios: {
      supportsTablet: true,
    },
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    updates: {
      url: "https://u.expo.dev/d99c71fb-e33c-4001-8adb-6bbd5a607796", // EAS Update URL
    },
    runtimeVersion: {
      policy: "appVersion", // matches version "2.0.0"
    },
    extra: {
      SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      eas: {
        projectId: "d99c71fb-e33c-4001-8adb-6bbd5a607796",
      },
    },
    web: {
      favicon: "./assets/favicon.png",
    },
  },
};
