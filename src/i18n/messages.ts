import en from "@/messages/en.json";
import fr from "@/messages/fr.json";
import { defaultLocale, isLocale, type Locale } from "./config";

const messagesByLocale = {
  en,
  fr,
};

export type Messages = typeof en;

export function getLocale(locale: string): Locale {
  return isLocale(locale) ? locale : defaultLocale;
}

export function getMessages(locale: string): Messages {
  return messagesByLocale[getLocale(locale)];
}
