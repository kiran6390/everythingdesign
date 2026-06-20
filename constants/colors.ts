// Dark "music app" theme — near-black surfaces, neon-lime accent (black text on it).
export const C = {
  bg: "#0D0D0F",
  surface: "#1A1A1D",      // cards, pills, circle buttons
  surface2: "#232327",
  surface3: "#2C2C31",
  border: "#2A2A2E",
  accent: "#C8FF00",       // neon lime — fills (active pill, nav, FAB)
  accentDim: "#C8FF0022",
  onAccent: "#000000",     // text/icons on the lime accent
  text: "#FFFFFF",
  textSec: "#9A9AA0",
  textDim: "#5C5C62",
  // category tints
  purple: "#9B7CE0",
  purpleDim: "#9B7CE022",
  orange: "#FF6B35",
  orangeDim: "#FF6B3522",
  pink: "#FF4D8D",
  pinkDim: "#FF4D8D22",
  teal: "#00D4AA",
  tealDim: "#00D4AA22",
} as const;
