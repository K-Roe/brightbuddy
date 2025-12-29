import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { useRouter } from "expo-router";
import * as Speech from "expo-speech";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function Calm() {
  const router = useRouter();
  const isFocused = useIsFocused();

  const breatheAnim = useRef(new Animated.Value(1)).current;

  const [mode, setMode] = useState<"calm" | "deep" | "reset">("calm");
  const [feeling, setFeeling] = useState<string | null>(null);
  const [bubbles, setBubbles] = useState<any[]>([]);
  const [bubbleCount, setBubbleCount] = useState(0);

  const [phase, setPhase] = useState<"in" | "hold" | "out">("in");
  const [countdown, setCountdown] = useState(4);

  /* ---------------- FEELING REACTION ---------------- */
  const feelingTheme: Record<
    string,
    { bg: string; text: string; defaultMode: any; accent: string }
  > = {
    Happy: { bg: "#FFF7C8", text: "You’re doing great 💛", defaultMode: "reset", accent: "#E3C700" },
    Okay: { bg: "#EAF6FF", text: "Let’s keep things calm 💙", defaultMode: "calm", accent: "#2D4A8C" },
    Sad: { bg: "#DCEBFF", text: "It’s okay to feel sad 💙", defaultMode: "deep", accent: "#2460B9" },
    Angry: { bg: "#FFE0E0", text: "Let’s settle the storm ❤️", defaultMode: "deep", accent: "#D43F3F" },
    Overwhelmed: { bg: "#F1E8FF", text: "We’ll slow things down 💜", defaultMode: "calm", accent: "#7443B5" },
  };

  const theme =
    feeling && feelingTheme[feeling]
      ? feelingTheme[feeling]
      : { bg: "#EAF6FF", text: "Let’s slow down together", defaultMode: "calm", accent: "#2D4A8C" };

  /* ---------------- LOAD FEELING (NOW ALWAYS WORKS) ---------------- */
  const loadFeeling = async () => {
    const stored = await AsyncStorage.getItem("childFeelings");
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);
      const value = parsed?.value ?? parsed;

      setFeeling(value);
      setMode(feelingTheme[value]?.defaultMode ?? "calm");
    } catch {
      setFeeling(stored);
      setMode(feelingTheme[stored]?.defaultMode ?? "calm");
    }
  };

  // Load once when screen mounts
  useEffect(() => {
    loadFeeling();
  }, []);

  // Load again when screen regains focus
  useEffect(() => {
    if (isFocused) loadFeeling();
  }, [isFocused]);

  /* ---------------- VOICE ---------------- */
  const speakSoft = (text: string) => {
    Speech.stop();
    Speech.speak(text, { pitch: 0.9, rate: 0.9, volume: 1.0 });
  };

  /* ---------------- BREATHING COUNTS ---------------- */
  const modeBreath = {
    calm: { in: 4, hold: 2, out: 4 },
    deep: { in: 5, hold: 3, out: 5 },
    reset: { in: 3, hold: 1, out: 3 },
  };

  useEffect(() => {
    let current = modeBreath[mode];
    setPhase("in");
    setCountdown(current.in);

    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c > 1) return c - 1;

        setPhase((p) => {
          if (p === "in") {
            setCountdown(current.hold);
            return "hold";
          }
          if (p === "hold") {
            setCountdown(current.out);
            return "out";
          }
          setCountdown(current.in);
          return "in";
        });

        return 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [mode]);

  /* ---------------- BREATHING ANIMATION ---------------- */
  const getDuration = () => {
    switch (mode) {
      case "calm": return 4500;
      case "deep": return 6000;
      case "reset": return 3000;
    }
  };

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(breatheAnim, {
          toValue: 1.25,
          duration: getDuration(),
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(breatheAnim, {
          toValue: 1,
          duration: getDuration(),
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [mode]);

  /* ---------------- BUBBLES ---------------- */
  const createBubble = () => ({
    id: Math.random(),
    y: new Animated.Value(200),
    x: new Animated.Value(0),
    scale: new Animated.Value(1),
    left: Math.random() * (width - 130),
  });

  useEffect(() => {
    const initial = Array.from({ length: 5 }).map(() => createBubble());
    setBubbles(initial);
  }, []);

  const startDrift = (bubble: any) => {
    bubble.y.setValue(200);

    Animated.timing(bubble.y, {
      toValue: 0,
      duration: 7000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => startDrift(bubble));

    Animated.loop(
      Animated.sequence([
        Animated.timing(bubble.x, { toValue: 10, duration: 2500, useNativeDriver: true }),
        Animated.timing(bubble.x, { toValue: -10, duration: 2500, useNativeDriver: true }),
      ])
    ).start();
  };

  useEffect(() => {
    bubbles.forEach((b) => startDrift(b));
  }, [bubbles]);

  const popBubble = (id: number) => {
    const bubble = bubbles.find((b) => b.id === id);
    if (!bubble) return;

    Speech.stop();
    Speech.speak("pop", { pitch: 0.9, rate: 0.9 });

    Animated.timing(bubble.scale, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      bubble.scale.setValue(1);
      bubble.left = Math.random() * (width - 120);
      startDrift(bubble);
      setBubbles([...bubbles]);
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Calm Corner</Text>
        <Text style={[styles.sub, { color: theme.accent }]}>{theme.text}</Text>
      </View>

      {/* Breathing */}
      <Animated.View style={[styles.circle, { transform: [{ scale: breatheAnim }], borderColor: theme.accent }]}>
        <Text style={[styles.phaseText, { color: theme.accent }]}>
          {phase === "in" && "Breathe in…"}
          {phase === "hold" && "Hold…"}
          {phase === "out" && "Breathe out…"}
        </Text>
        <Text style={styles.count}>{countdown}</Text>
      </Animated.View>

      {/* Modes */}
      <View style={styles.modeRow}>
        <ModeBtn text="Calm" active={mode === "calm"} onPress={() => setMode("calm")} />
        <ModeBtn text="Deep" active={mode === "deep"} onPress={() => setMode("deep")} />
        <ModeBtn text="Reset" active={mode === "reset"} onPress={() => setMode("reset")} />
      </View>

      {/* Bubbles */}
      <View style={styles.bubbleArea}>
        {bubbles.map((b) => (
          <Animated.View
            key={b.id}
            style={{
              position: "absolute",
              transform: [{ translateY: b.y }, { scale: b.scale }, { translateX: b.x }],
              left: b.left,
              opacity: 0.9,
            }}
          >
            <TouchableOpacity onPress={() => popBubble(b.id)}>
              <Text style={{ fontSize: 30 }}>🫧</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardText}>You’re doing really well.{"\n"}Stay as long as you like.</Text>
      </View>

      <TouchableOpacity style={styles.exitBtn} onPress={() => router.back()}>
        <Text style={styles.exitText}>I feel a little better 😊</Text>
      </TouchableOpacity>
    </View>
  );
}

/* ---------------- Buttons ---------------- */
function ModeBtn({ text, active, onPress }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.modeBtn, { backgroundColor: active ? "#4F46E5" : "#E3E7FF" }]}
    >
      <Text style={{ color: active ? "#fff" : "#333", fontWeight: "800" }}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}

/* ---------------- Styles ---------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 100,
    justifyContent: "space-between",
  },

  header: { alignItems: "center" },
  title: { fontSize: 28, fontWeight: "900", color: "#1C2F60" },
  sub: { fontSize: 16, marginTop: 6, textAlign: "center", paddingHorizontal: 20 },

  circle: {
    width: 200,
    height: 200,
    borderRadius: 120,
    backgroundColor: "#ffffff70",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
  },

  phaseText: { fontSize: 16, fontWeight: "900" },
  count: { fontSize: 36, fontWeight: "900", color: "#333" },

  modeRow: { flexDirection: "row", gap: 8, marginTop: 10 },
  modeBtn: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 25 },

  bubbleArea: { width: "100%", height: 180, marginTop: 5 },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 18,
  },
  cardText: { textAlign: "center", color: "#4B4B4B", fontSize: 15 },

  exitBtn: {
    backgroundColor: "#CFF5D3",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    marginTop: 5,
  },
  exitText: { fontSize: 16, fontWeight: "800", color: "#2B7A3F" },
});
