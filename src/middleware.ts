import createMiddleware from "next-intl/middleware";
import { defaultLocale, locales } from "@/i18n/config";

export default createMiddleware({
  defaultLocale,
  locales,
  localePrefix: "always",
});

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
