import { getRequestConfig } from "next-intl/server";
import { defaultLocale } from "./config";
import { getLocale, getMessages } from "./messages";

export default getRequestConfig(async ({ requestLocale }) => {
  const safeLocale = getLocale((await requestLocale) ?? defaultLocale);

  return {
    locale: safeLocale,
    messages: getMessages(safeLocale),
  };
});
