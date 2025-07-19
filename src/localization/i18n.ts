import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// 🔒 Safely get device language
const locales = Localization.getLocales();
const deviceLocale = locales?.[0]?.languageCode ?? "en";

// Supported languages
const supportedLanguages = ["en", "kpelle"] as const;
type SupportedLanguage = (typeof supportedLanguages)[number];

const languageToUse: SupportedLanguage = supportedLanguages.includes(
  deviceLocale as SupportedLanguage
)
  ? (deviceLocale as SupportedLanguage)
  : "en";

// Resources
const resources = {
  en: {
    translation: {
      welcome: "Welcome to NEC Companion 🇱🇷",
      intro: "Your trusted election companion app.",
      next: "Next",
      language_prompt: "Please select your language",
      english: "English",
      kpelle: "Kpelle",
      finish: "Finish",
      education: "Voter Education",
      report_issue: "Report an Issue",
      reset_onboarding: "Reset Onboarding",
      report_issue_header: "Report an Issue",
      title_placeholder: "Issue Title",
      description_placeholder: "Describe the issue in detail...",
      submit: "Submit",
      thank_you: "Thank you for reporting. We’ll review your submission.",
      error: "Error",
      fill_required_fields: "Please fill in both title and description.",
    },
  },
  kpelle: {
    translation: {
      welcome: "Bo kɛ NEC Companion",
      intro: "Bo kɛ NEC Companion",
      next: "Next",
      language_prompt: "Select language in Kpelle",
      english: "English",
      kpelle: "Kpelle",
      finish: "Finish",
      education: "Boɔ fɔlɛ kuraa",
      report_issue: "Yɛli suɛ jɔɔ",
      reset_onboarding: "Gboɔ yala fɔlɛ kuraa",
      report_issue_header: "Kpelle: Report an Issue",
      title_placeholder: "Kpelle: Issue Title",
      description_placeholder: "Kpelle: Describe the issue...",
      submit: "Submit",
      thank_you: "Thank you",
      error: "Error",
      fill_required_fields: "Please fill all fields",
    },
  },
};

i18n.use(initReactI18next).init({
  compatibilityJSON: "v4",
  resources,
  lng: languageToUse,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
