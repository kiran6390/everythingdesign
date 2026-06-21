import { useEffect, useState } from "react";
import { Dimensions, ImageBackground, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { C } from "@/constants/colors";
import type { Club } from "@/data/happenings";

const width = Math.min(Dimensions.get("window").width, 480); // clamp to the app column
const CARD_W = Math.min(310, width * 0.82);
const CARD_H = CARD_W * 1.4;
const THRESHOLD = 80;

// Slot offsets — behind cards fan out to the sides (Swiper "cards" look).
const MID = { tx: 26, rot: 6, scale: 0.93 };   // next card peeks right
const BACK = { tx: -26, rot: -6, scale: 0.88 }; // the one after peeks left

// "Glowing shadows" — a soft single-colour glow that orbits the deck and
// cross-fades through 10 colours picked from the rainbow gradient.
const GLOW = CARD_W * 1.9;        // glow blob diameter
const ORBIT_R = CARD_W * 0.45;    // how far the glow orbits from the card centre
const HUES = ["#ff3b3b", "#ff7a1a", "#ffb000", "#ffe600", "#9bff3b", "#1fd17a", "#00e5ff", "#2b6bff", "#7a4cff", "#e54cff"];

function SoftGlow({ color }: { color: string }) {
  const id = `g${color.replace("#", "")}`;
  return (
    <Svg width={GLOW} height={GLOW} style={{ position: "absolute" }}>
      <Defs>
        <RadialGradient id={id} cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor={color} stopOpacity={0.85} />
          <Stop offset="40%" stopColor={color} stopOpacity={0.38} />
          <Stop offset="72%" stopColor={color} stopOpacity={0.12} />
          <Stop offset="100%" stopColor={color} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Rect x="0" y="0" width={GLOW} height={GLOW} fill={`url(#${id})`} />
    </Svg>
  );
}

function GlowLayer() {
  const rot = useSharedValue(0);
  const t = useSharedValue(0);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    rot.value = withRepeat(withTiming(1, { duration: 9000, easing: Easing.linear }), -1, false);
  }, []);

  // cross-fade to the next colour, then advance (seamless loop through 10 colours)
  useEffect(() => {
    t.value = 0;
    t.value = withTiming(1, { duration: 1800, easing: Easing.linear }, (f) => {
      if (f) runOnJS(setIdx)((idx + 1) % HUES.length);
    });
  }, [idx]);

  const rotStyle = useAnimatedStyle(() => ({ transform: [{ rotateZ: `${rot.value * 360}deg` }] }));
  const aStyle = useAnimatedStyle(() => ({ opacity: 1 - t.value }));
  const bStyle = useAnimatedStyle(() => ({ opacity: t.value }));

  const from = HUES[idx];
  const to = HUES[(idx + 1) % HUES.length];

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        { position: "absolute", top: 16, left: "50%", marginLeft: -CARD_W / 2, width: CARD_W, height: CARD_H },
        rotStyle,
      ]}
    >
      {/* offset from centre so the rotation makes the glow orbit the card */}
      <View style={{ position: "absolute", top: CARD_H / 2 - ORBIT_R - GLOW / 2, left: CARD_W / 2 - GLOW / 2, width: GLOW, height: GLOW }}>
        <Animated.View style={[{ position: "absolute", width: GLOW, height: GLOW }, aStyle]}>
          <SoftGlow color={from} />
        </Animated.View>
        <Animated.View style={[{ position: "absolute", width: GLOW, height: GLOW }, bStyle]}>
          <SoftGlow color={to} />
        </Animated.View>
      </View>
    </Animated.View>
  );
}

function CardFace({ item }: { item: Club }) {
  return (
    <ImageBackground source={{ uri: item.image }} style={{ flex: 1 }}>
      <LinearGradient colors={["rgba(0,0,0,0.15)", "transparent", "rgba(0,0,0,0.8)"]} locations={[0, 0.45, 1]} style={{ flex: 1, padding: 14, justifyContent: "space-between" }}>
        <View style={{ alignSelf: "flex-end", flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "rgba(255,255,255,0.18)", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 14 }}>
          <Ionicons name="star" size={11} color="#FFD24A" />
          <Text style={{ color: "#fff", fontWeight: "800", fontSize: 12 }}>{item.rating.toFixed(1)}</Text>
        </View>
        <View>
          <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 12, fontWeight: "600" }}>{item.area}</Text>
          <Text style={{ color: "#fff", fontSize: 20, fontWeight: "800" }}>{item.name}</Text>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

// Front card: draggable, and grows in from the right (mid) slot to centre.
function FrontCard({ item, onSwipe }: { item: Club; onSwipe: (tx: number, ty: number) => void }) {
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const enter = useSharedValue(0); // 0 = right slot, 1 = front

  useEffect(() => {
    enter.value = withTiming(1, { duration: 300 });
  }, []);

  const pan = Gesture.Pan()
    .activeOffsetX([-12, 12])
    .onUpdate((e) => {
      tx.value = e.translationX;
      ty.value = e.translationY;
    })
    .onEnd((e) => {
      if (Math.abs(e.translationX) > THRESHOLD) {
        runOnJS(onSwipe)(tx.value, ty.value);
      } else {
        tx.value = withSpring(0);
        ty.value = withSpring(0);
      }
    });

  const style = useAnimatedStyle(() => {
    const k = 1 - enter.value;
    const dragRot = interpolate(tx.value, [-width / 2, width / 2], [-14, 14]);
    return {
      zIndex: 3,
      transform: [
        { translateX: tx.value + k * MID.tx },
        { translateY: ty.value },
        { scale: MID.scale + (1 - MID.scale) * enter.value },
        { rotate: `${dragRot + k * MID.rot}deg` },
      ],
    };
  });

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.card, style]}>
        <CardFace item={item} />
      </Animated.View>
    </GestureDetector>
  );
}

// Swiped card: tucks into the left (back) slot, behind the deck.
function ExitingCard({ item, startTx, startTy, onDone }: { item: Club; startTx: number; startTy: number; onDone: () => void }) {
  const tx = useSharedValue(startTx);
  const ty = useSharedValue(startTy);
  const scale = useSharedValue(1);
  const rot = useSharedValue(interpolate(startTx, [-width / 2, width / 2], [-14, 14]));

  useEffect(() => {
    const dir = Math.sign(startTx || 1);
    tx.value = withTiming(dir * 80, { duration: 130 }, () => {
      tx.value = withTiming(BACK.tx, { duration: 340 });
    });
    ty.value = withTiming(0, { duration: 470 });
    rot.value = withTiming(BACK.rot, { duration: 470 });
    scale.value = withTiming(BACK.scale, { duration: 470 }, (f) => {
      if (f) runOnJS(onDone)();
    });
  }, []);

  const style = useAnimatedStyle(() => ({
    zIndex: 0,
    transform: [{ translateX: tx.value }, { translateY: ty.value }, { scale: scale.value }, { rotate: `${rot.value}deg` }],
  }));

  return (
    <Animated.View pointerEvents="none" style={[styles.card, style]}>
      <CardFace item={item} />
    </Animated.View>
  );
}

export default function CardStack({ items }: { items: Club[] }) {
  const len = items.length;
  const [index, setIndex] = useState(0);
  const [exiting, setExiting] = useState<{ item: Club; tx: number; ty: number } | null>(null);

  const top = items[index % len];
  const mid = items[(index + 1) % len];
  const back = items[(index + 2) % len];

  const onSwipe = (tx: number, ty: number) => {
    setExiting({ item: top, tx, ty });
    setIndex((i) => (i + 1) % len);
  };

  return (
    <View style={{ height: CARD_H + 40, justifyContent: "center" }}>
      {/* glow behind the deck */}
      <GlowLayer />
      {/* back — peeks left */}
      <Animated.View style={[styles.card, { transform: [{ translateX: BACK.tx }, { scale: BACK.scale }, { rotate: `${BACK.rot}deg` }], zIndex: 1 }]}>
        <CardFace item={back} />
      </Animated.View>
      {/* mid — peeks right */}
      <Animated.View style={[styles.card, { transform: [{ translateX: MID.tx }, { scale: MID.scale }, { rotate: `${MID.rot}deg` }], zIndex: 2 }]}>
        <CardFace item={mid} />
      </Animated.View>
      {/* front */}
      <FrontCard key={index} item={top} onSwipe={onSwipe} />
      {/* swiped card tucking to the back */}
      {exiting && (
        <ExitingCard key={`exit-${index}`} item={exiting.item} startTx={exiting.tx} startTy={exiting.ty} onDone={() => setExiting(null)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: "absolute",
    top: 16,
    left: "50%",
    marginLeft: -CARD_W / 2,
    width: CARD_W,
    height: CARD_H,
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: C.surface3,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
});
