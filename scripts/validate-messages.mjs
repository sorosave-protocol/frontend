import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const locales = ["en", "fr"];
const messagesDir = join(process.cwd(), "src", "messages");

function flattenKeys(value, prefix = "") {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return [prefix];
  }

  return Object.entries(value).flatMap(([key, child]) =>
    flattenKeys(child, prefix ? `${prefix}.${key}` : key),
  );
}

const localeKeys = new Map();

for (const locale of locales) {
  const path = join(messagesDir, `${locale}.json`);

  if (!existsSync(path)) {
    throw new Error(`Missing message file: ${path}`);
  }

  const messages = JSON.parse(readFileSync(path, "utf8"));
  const keys = flattenKeys(messages).filter(Boolean).sort();

  if (keys.length === 0) {
    throw new Error(`Message file has no keys: ${path}`);
  }

  localeKeys.set(locale, keys);
}

const [baseLocale] = locales;
const baseKeys = localeKeys.get(baseLocale);

for (const locale of locales.slice(1)) {
  const keys = localeKeys.get(locale);
  const missing = baseKeys.filter((key) => !keys.includes(key));
  const extra = keys.filter((key) => !baseKeys.includes(key));

  if (missing.length || extra.length) {
    throw new Error(
      [
        `Message keys do not match for ${locale}.`,
        missing.length ? `Missing: ${missing.join(", ")}` : "",
        extra.length ? `Extra: ${extra.join(", ")}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    );
  }
}

console.log(
  `Validated ${baseKeys.length} message keys across ${locales.length} locales.`,
);
