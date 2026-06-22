import {Pathnames} from "next-intl/routing";
import {CreateNavigationTypes} from "next-intl/routing";

export const prefixDefaultLocale = true;

export const routing: CreateNavigationTypes<Pathnames>["routing"] = {
  locales: {
    default: "en",
    known: ["en", "zh"],
  },
  defaultLocale: "en",
  pathnames: {},
};
