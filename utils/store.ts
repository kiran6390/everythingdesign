import { Alert, Platform } from "react-native";
import { router } from "expo-router";
import type { Happening, Programme } from "@/data/happenings";
import { SAMPLE_PROGRAMMES } from "@/data/happenings";
import * as db from "@/lib/db";
import * as Location from "expo-location";
import { nearestNeighborhood, neighborhoodCenter } from "@/lib/places";

// Auth-at-intent: prompt a guest to sign in (phone OTP) the first time they take a
// key action — but never block them; the action still happens locally.
let signInPrompted = false;
function softAuthPrompt() {
  if (state.userId || signInPrompted) return;
  signInPrompted = true;
  Alert.alert(
    "Keep your plans?",
    "Sign in with your number to save your check-ins, saves and plans across devices.",
    [
      { text: "Not now", style: "cancel" },
      { text: "Sign in", onPress: () => router.push("/(onboarding)/phone") },
    ]
  );
}

type State = {
  onboarded: boolean;
  userId: string | null; // null in guest mode
  userName: string;
  neighborhood: string;
  coords: { lat: number; lng: number } | null; // user's GPS, once resolved
  vibes: string[]; // interests (categories) picked in onboarding
  saved: string[]; // saved happening ids
  going: string[]; // going happening ids
  shared: Happening[]; // happenings shared by the community (from server)
  programmes: Programme[]; // operator overlay: tonight's programme + vibe per venue
};

const state: State = {
  onboarded: false,
  userId: null,
  userName: "there",
  neighborhood: "Bandra",
  coords: null,
  vibes: [],
  saved: [],
  going: [],
  shared: [],
  programmes: SAMPLE_PROGRAMMES,
};

const listeners = new Set<() => void>();
function notify() {
  listeners.forEach((l) => l());
}

export const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
export const getSnapshot = () => state;

export function setOnboarded(name: string) {
  state.onboarded = true;
  state.userName = name || "there";
  notify();
}

// Called after a Supabase session is available — pulls the user's data.
export async function hydrate(userId: string, fallbackName: string) {
  state.userId = userId;
  state.onboarded = true;
  state.userName = fallbackName || state.userName;
  notify();
  try {
    const [profile, marks, shared] = await Promise.all([
      db.fetchProfile(userId),
      db.fetchUserHappenings(userId),
      db.fetchSharedHappenings(userId),
    ]);
    if (profile?.name) state.userName = profile.name.split(" ")[0];
    if (profile?.neighborhood) state.neighborhood = profile.neighborhood;
    state.saved = marks.saved;
    state.going = marks.going;
    state.shared = shared;
    notify();
  } catch {
    // Offline or schema not set up yet — keep optimistic local state.
  }
}

// Best-effort live location → updates the home pill to the user's real area.
// Runs once; silently keeps the default if permission is denied or it fails.
let locationInFlight = false;
let locationResolved = false;

// Get GPS coords. On web, expo-location is unreliable, so call the browser
// geolocation API directly (prompts properly when triggered by a click).
async function getPositionCoords(): Promise<{ lat: number; lng: number } | null> {
  if (Platform.OS === "web") {
    const nav: any = (globalThis as any).navigator;
    if (!nav?.geolocation) return null;
    return new Promise((resolve) => {
      nav.geolocation.getCurrentPosition(
        (p: any) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
        () => resolve(null),
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
      );
    });
  }
  let { status } = await Location.getForegroundPermissionsAsync();
  if (status !== "granted") status = (await Location.requestForegroundPermissionsAsync()).status;
  if (status !== "granted") return null;
  let loc = await Location.getLastKnownPositionAsync();
  if (!loc) loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low });
  return loc ? { lat: loc.coords.latitude, lng: loc.coords.longitude } : null;
}

export async function detectLocation(force = false) {
  if (force) {
    locationResolved = false;
    locationInFlight = false; // allow re-trigger even if a prior attempt stalled
  }
  if (locationInFlight || locationResolved) return;
  locationInFlight = true;
  try {
    const pos = await getPositionCoords();
    if (!pos) return;

    state.coords = pos;
    notify();

    // deterministic: snap to nearest known Mumbai area
    let area = nearestNeighborhood(pos.lat, pos.lng);

    // reverse geocode fallback (native only — not supported on web)
    if (!area && Platform.OS !== "web") {
      try {
        const geo = await Location.reverseGeocodeAsync({ latitude: pos.lat, longitude: pos.lng });
        const g = geo[0];
        area = g?.district || g?.subregion || g?.city || null;
      } catch {}
    }

    state.neighborhood = area || "Mumbai";
    locationResolved = true;
    notify();
    if (state.userId && area) db.updateNeighborhood(state.userId, area).catch(() => {});
  } catch {
    // ignore — keep the existing neighborhood
  } finally {
    locationInFlight = false;
  }
}

export function setVibes(v: string[]) {
  state.vibes = v;
  notify();
}

export function setNeighborhood(n: string) {
  state.neighborhood = n;
  notify();
  if (state.userId) db.updateNeighborhood(state.userId, n).catch(() => {});
}

// Manual area pick — sets the neighborhood AND its centre coords, so the
// location-based feed ("Around you") loads even when GPS is blocked.
export function setManualArea(n: string) {
  state.neighborhood = n;
  const c = neighborhoodCenter(n);
  if (c) state.coords = c;
  locationResolved = true;
  notify();
  if (state.userId) db.updateNeighborhood(state.userId, n).catch(() => {});
}

export function toggleSave(id: string) {
  const on = !state.saved.includes(id);
  state.saved = on ? [...state.saved, id] : state.saved.filter((x) => x !== id);
  notify();
  if (state.userId) db.setSaveState(state.userId, id, "saved", on).catch(() => {});
  if (on) softAuthPrompt();
}

export function toggleGoing(id: string) {
  const on = !state.going.includes(id);
  state.going = on ? [...state.going, id] : state.going.filter((x) => x !== id);
  notify();
  if (state.userId) db.setSaveState(state.userId, id, "going", on).catch(() => {});
  if (on) softAuthPrompt();
}

// Operator publishes tonight's programme + vibe for a venue (the moat data).
export function addProgramme(p: Programme) {
  state.programmes = [p, ...state.programmes];
  notify();
  softAuthPrompt();
}

// A check-in is just a "happening right now" at a venue.
export function checkInAt(h: Happening) {
  addPosted(h);
  if (!state.going.includes(h.id)) {
    state.going = [...state.going, h.id];
    notify();
    if (state.userId) db.setSaveState(state.userId, h.id, "going", true).catch(() => {});
  }
  softAuthPrompt();
}

export function addPosted(h: Happening) {
  // optimistic insert
  state.shared = [{ ...h, mine: true }, ...state.shared];
  notify();
  if (state.userId) {
    db.insertHappening(state.userId, h)
      .then((saved) => {
        if (saved) {
          // replace the optimistic temp entry with the server row (real id)
          state.shared = [saved, ...state.shared.filter((x) => x.id !== h.id)];
          notify();
        }
      })
      .catch(() => {});
  }
}
