"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  detectRegion,
  getStoredRegion,
  setStoredRegion,
  type DetectableRegion,
} from "@/lib/region-detection";

interface RegionContextValue {
  region: DetectableRegion;
  setRegion: (region: DetectableRegion) => void;
  /** true once a region has been detected or chosen (vs. the initial default) */
  resolved: boolean;
  /** true when the current region came from auto-detection, not a manual choice */
  autoDetected: boolean;
}

const RegionContext = createContext<RegionContextValue>({
  region: "Global",
  setRegion: () => {},
  resolved: false,
  autoDetected: false,
});

export function useRegion() {
  return useContext(RegionContext);
}

export function RegionProvider({ children }: { children: ReactNode }) {
  const [region, setRegionState] = useState<DetectableRegion>("Global");
  const [resolved, setResolved] = useState(false);
  const [autoDetected, setAutoDetected] = useState(false);

  useEffect(() => {
    const stored = getStoredRegion();
    if (stored) {
      setRegionState(stored);
      setResolved(true);
      return;
    }
    let active = true;
    detectRegion().then((r) => {
      if (!active) return;
      setRegionState(r);
      setAutoDetected(r !== "Global");
      setResolved(true);
    });
    return () => {
      active = false;
    };
  }, []);

  const setRegion = useCallback((r: DetectableRegion) => {
    setRegionState(r);
    setStoredRegion(r);
    setAutoDetected(false);
    setResolved(true);
  }, []);

  const value = useMemo(
    () => ({ region, setRegion, resolved, autoDetected }),
    [region, setRegion, resolved, autoDetected]
  );

  return <RegionContext.Provider value={value}>{children}</RegionContext.Provider>;
}
