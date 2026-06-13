// Client-side region detection for surfacing region-specific calculators.
// Strategy: stored manual preference → IP geolocation (ipapi.co) → timezone
// fallback → "Global".

export type DetectableRegion =
  | "US"
  | "CA"
  | "UK"
  | "DE"
  | "CH"
  | "NO"
  | "NZ"
  | "AU"
  | "RU"
  | "EU"
  | "Global";

const PREF_KEY = "preferredRegion"; // explicit user choice (wins)
const CACHE_KEY = "detectedRegion"; // last auto-detected value

export const REGION_NAMES: Record<DetectableRegion, string> = {
  US: "United States",
  CA: "Canada",
  UK: "United Kingdom",
  DE: "Germany",
  CH: "Switzerland",
  NO: "Norway",
  NZ: "New Zealand",
  AU: "Australia",
  RU: "Russia",
  EU: "Europe",
  Global: "All Regions",
};

// Flags render as SVG via the <RegionFlag> component (components/RegionFlag.tsx).

// Order shown in selectors.
export const REGION_ORDER: DetectableRegion[] = [
  "US",
  "CA",
  "UK",
  "DE",
  "CH",
  "NO",
  "NZ",
  "AU",
  "RU",
  "EU",
  "Global",
];

const VALID = new Set<string>(REGION_ORDER);

// ISO country code → region.
const COUNTRY_TO_REGION: Record<string, DetectableRegion> = {
  US: "US",
  CA: "CA",
  GB: "UK",
  UK: "UK",
  DE: "DE",
  CH: "CH",
  NO: "NO",
  NZ: "NZ",
  AU: "AU",
  RU: "RU",
};

const CA_TIMEZONES = [
  "America/Toronto",
  "America/Vancouver",
  "America/Edmonton",
  "America/Winnipeg",
  "America/Halifax",
  "America/St_Johns",
  "America/Regina",
  "America/Moncton",
];

export function isValidRegion(v: string | null | undefined): v is DetectableRegion {
  return !!v && VALID.has(v);
}

export function getStoredRegion(): DetectableRegion | null {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(PREF_KEY);
  return isValidRegion(v) ? v : null;
}

export function setStoredRegion(region: DetectableRegion): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PREF_KEY, region);
}

function timezoneRegion(): DetectableRegion {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (tz === "Europe/London") return "UK";
    if (tz === "Europe/Berlin") return "DE";
    if (tz === "Europe/Zurich") return "CH";
    if (tz === "Europe/Oslo") return "NO";
    if (tz === "Europe/Moscow") return "RU";
    if (tz.startsWith("Australia/")) return "AU";
    if (tz === "Pacific/Auckland") return "NZ";
    if (CA_TIMEZONES.includes(tz)) return "CA";
    if (tz.startsWith("America/")) return "US";
    if (tz.startsWith("Europe/")) return "EU";
  } catch {
    /* ignore */
  }
  return "Global";
}

export async function detectRegion(): Promise<DetectableRegion> {
  if (typeof window === "undefined") return "Global";

  // 1. IP geolocation (free, no key). Best-effort, with a hard timeout so a
  // slow or blocked response never delays region resolution / the UI.
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);
    const res = await fetch("https://ipapi.co/json/", {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout));
    if (res.ok) {
      const data = await res.json();
      const region = COUNTRY_TO_REGION[data.country_code] ?? timezoneRegion();
      window.localStorage.setItem(CACHE_KEY, region);
      return region;
    }
  } catch {
    /* fall through to timezone */
  }

  // 2. Timezone fallback
  const tzRegion = timezoneRegion();
  window.localStorage.setItem(CACHE_KEY, tzRegion);
  return tzRegion;
}
