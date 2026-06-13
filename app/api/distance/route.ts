import { NextRequest, NextResponse } from "next/server";

// Driving-distance lookup using only free OpenStreetMap services:
//   1. Nominatim geocodes each place name to coordinates.
//   2. OSRM computes the driving route distance between them.
// Done server-side so we can send the User-Agent that Nominatim's usage policy
// requires and avoid browser CORS limits. Best-effort: public servers are rate
// limited, so callers should keep manual entry as a fallback.

export const runtime = "nodejs";
// Cache identical lookups at the edge for a day - place-to-place road distance
// does not change, and this keeps us well within the free rate limits.
export const revalidate = 86400;

const NOMINATIM = "https://nominatim.openstreetmap.org/search";
const OSRM = "https://router.project-osrm.org/route/v1/driving";
const UA = "OnlineCalc/1.0 (https://online-calc.com; fuel-cost-calculator)";

interface GeoPoint {
  lat: number;
  lon: number;
  label: string;
}

async function geocode(query: string): Promise<GeoPoint | null> {
  const url = `${NOMINATIM}?q=${encodeURIComponent(query)}&format=json&limit=1&addressdetails=0`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "application/json" },
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const data = (await res.json()) as Array<{
      lat: string;
      lon: string;
      display_name: string;
    }>;
    if (!data.length) return null;
    return {
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon),
      label: data[0].display_name,
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function drivingMetres(a: GeoPoint, b: GeoPoint): Promise<number | null> {
  const url = `${OSRM}/${a.lon},${a.lat};${b.lon},${b.lat}?overview=false&alternatives=false&steps=false`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "application/json" },
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      code: string;
      routes?: Array<{ distance: number }>;
    };
    if (data.code !== "Ok" || !data.routes?.length) return null;
    return data.routes[0].distance; // metres
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const origin = (searchParams.get("origin") || "").trim();
  const destination = (searchParams.get("destination") || "").trim();

  if (!origin || !destination) {
    return NextResponse.json(
      { error: "Please enter both a start and a destination." },
      { status: 400 }
    );
  }

  // Geocode both endpoints in parallel.
  const [from, to] = await Promise.all([geocode(origin), geocode(destination)]);

  if (!from) {
    return NextResponse.json(
      { error: `Could not find a location for "${origin}". Try adding a city or country.` },
      { status: 404 }
    );
  }
  if (!to) {
    return NextResponse.json(
      { error: `Could not find a location for "${destination}". Try adding a city or country.` },
      { status: 404 }
    );
  }

  const metres = await drivingMetres(from, to);
  if (metres == null) {
    return NextResponse.json(
      { error: "Could not find a driving route between those places. Enter the distance manually." },
      { status: 502 }
    );
  }

  const km = metres / 1000;
  const miles = km / 1.609344;

  return NextResponse.json({
    km: Math.round(km * 10) / 10,
    miles: Math.round(miles * 10) / 10,
    originLabel: from.label,
    destinationLabel: to.label,
  });
}
