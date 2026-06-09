// Supported display languages for the UI. Selection is persisted; full message
// translation is wired later (next-intl) - this provides the chooser + intent.

export interface Language {
  code: string;
  label: string; // native label
  english: string;
  rtl?: boolean;
}

export const LANGUAGES: Language[] = [
  { code: "en", label: "English", english: "English" },
  { code: "es", label: "Español", english: "Spanish" },
  { code: "fr", label: "Français", english: "French" },
  { code: "de", label: "Deutsch", english: "German" },
  { code: "it", label: "Italiano", english: "Italian" },
  { code: "no", label: "Norsk", english: "Norwegian" },
  { code: "ru", label: "Русский", english: "Russian" },
  { code: "zh", label: "中文", english: "Chinese" },
  { code: "ar", label: "العربية", english: "Arabic", rtl: true },
];

export const DEFAULT_LANGUAGE = "en";

export function getLanguage(code: string): Language {
  return LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0];
}
