import type { FC, SVGProps } from "react";
import * as Flags from "country-flag-icons/react/3x2";
import { FiGlobe } from "react-icons/fi";
import type { DetectableRegion } from "@/lib/region-detection";

// Map our region codes to ISO 3166-1 alpha-2 codes used by country-flag-icons.
// UK -> GB, and "Global" has no national flag (we render a globe instead).
const FLAG_CODE: Record<DetectableRegion, string> = {
  US: "US",
  CA: "CA",
  UK: "GB",
  DE: "DE",
  CH: "CH",
  NO: "NO",
  NZ: "NZ",
  AU: "AU",
  RU: "RU",
  EU: "EU",
  Global: "",
};

type FlagComponent = FC<SVGProps<SVGSVGElement> & { title?: string }>;

export function RegionFlag({
  region,
  className = "inline-block h-[1em] w-auto rounded-sm align-[-0.1em]",
}: {
  region: DetectableRegion;
  className?: string;
}) {
  const code = FLAG_CODE[region];
  const Flag = code ? (Flags as Record<string, FlagComponent>)[code] : undefined;
  if (!Flag) {
    return <FiGlobe className={className} aria-hidden />;
  }
  return <Flag className={className} title={region} />;
}
