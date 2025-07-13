import "dotenv/config";

export default {
  expo: {
    name: "NECCompanion",
    slug: "neccompanion",
    version: "1.0.0",
    sdkVersion: "53.0.0",
    plugins: ["expo-localization"],
    android: {
      package: "com.emspire.neccompanion", // ← unique identifier
    },
    extra: {
      SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      eas: {
        projectId: "d99c71fb-e33c-4001-8adb-6bbd5a607796",
      },
    },
  },
};
