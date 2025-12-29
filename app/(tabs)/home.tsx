import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import * as Speech from "expo-speech";
import { useCallback, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ThemedAlert from "../../components/ThemedAlert";
import { useThemedAlert } from "../hooks/useThemedAlert";

export default function Home() {
  const [feelings, setFeelings] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ completed: number; total: number } | null>(null);

  const { alertVisible, alertTitle, alertMsg, showAlert, hideAlert } =
    useThemedAlert();

  /* ---------------- SAVE FEELINGS ---------------- */
  const saveFeelings = async (value: string) => {
    try {
      setFeelings(value);
      speakTheFeeling(value);
      await AsyncStorage.setItem("childFeelings", value);
    } catch (e) {
      showAlert("Error", "Failed to save your feelings. Please try again.");
    }
  };

  /* ---------------- LOAD FEELINGS + PROGRESS ---------------- */
  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        // Routine Progress
        const data = await AsyncStorage.getItem("routineProgress");
        if (data) setProgress(JSON.parse(data));

        // Saved Feeling
        const savedFeeling = await AsyncStorage.getItem("childFeelings");
        if (savedFeeling) setFeelings(savedFeeling);
      };

      load();
    }, [])
  );

  /* ---------------- FEELING COLORS ---------------- */
  const feelingColors: Record<string, string> = {
    Happy: "#FFF3B0",
    Okay: "#E0ECFF",
    Sad: "#CFE4FF",
    Angry: "#FFD6D6",
    Overwhelmed: "#EAD9FF",
  };

  const speechSettings: Record<string, { rate: number; pitch: number }> = {
    Happy: { rate: 1.1, pitch: 1.2 },
    Okay: { rate: 1.0, pitch: 1.0 },
    Sad: { rate: 0.85, pitch: 0.9 },
    Angry: { rate: 0.9, pitch: 0.9 },
    Overwhelmed: { rate: 0.8, pitch: 0.95 },
  };

  const currentColor = feelings ? feelingColors[feelings] : "#DFF7EE";

  /* ---------------- SPEAK ---------------- */
  const speakTheFeeling = (value: string) => {
    const settings = speechSettings[value] || { rate: 1.0, pitch: 1.0 };

    Speech.speak(`You have said you feel ${value}`, {
      rate: settings.rate,
      pitch: settings.pitch,
    });
  };

  return (
    <View style={styles.container}>
      {/* Welcome */}
      <View style={styles.welcomeBox}>
        <Text style={styles.title}>Hi there 😊</Text>
        <Text style={styles.subText}>
          You're safe here. Let’s take today gently.
        </Text>
      </View>

      {/* Feelings Check-in */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How are you feeling?</Text>

        <View style={styles.feelingsRow}>
          <Feeling emoji="😊" label="Happy" onPress={saveFeelings} />
          <Feeling emoji="😐" label="Okay" onPress={saveFeelings} />
          <Feeling emoji="😞" label="Sad" onPress={saveFeelings} />
          <Feeling emoji="😡" label="Angry" onPress={saveFeelings} />
          <Feeling emoji="😵‍💫" label="Overwhelmed" onPress={saveFeelings} />
        </View>
      </View>

      {/* Feelings Corner */}
      {feelings && (
        <TouchableOpacity
          style={[styles.feelingCard, { backgroundColor: currentColor }]}
        >
          <Text style={styles.feelingTitle}>
            You have said you feel {feelings}.
          </Text>
          <Text style={styles.feelingText}>
            That’s okay. I’m here with you 💛
          </Text>
        </TouchableOpacity>
      )}

      {/* Calm Corner */}
      <TouchableOpacity
        style={styles.calmCard}
        onPress={() => {
          router.push("/(tabs)/calm");
        }}
      >
        <Text style={styles.calmTitle}>Need a quiet moment?</Text>
        <Text style={styles.calmText}>Tap here to relax and feel calm 🧘</Text>
      </TouchableOpacity>

      {/* Routine Progress */}
      <TouchableOpacity
        style={[
          styles.routineCard,
          progress
            ? progress.completed === progress.total
              ? styles.cardDone
              : progress.completed >= Math.ceil(progress.total / 2)
                ? styles.cardMid
                : styles.cardStart
            : styles.cardNeutral
        ]}
        onPress={() => {
          router.push("/(tabs)/routine");
        }}
      >
        <Text style={styles.routineTitle}>Routine Progress</Text>

        {progress ? (
          progress.completed === progress.total ? (
            <Text style={styles.routineText}>
              Amazing job! You finished everything today 🎉🌟
            </Text>
          ) : (
            <Text style={styles.routineText}>
              Completed {progress.completed} / {progress.total} 🎯{"\n"}
              You are doing great! Keep going!
            </Text>
          )
        ) : (
          <Text style={styles.routineText}>
            Tap here to see your routine progress 📊
          </Text>
        )}
      </TouchableOpacity>


      {/* Start My Day */}
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => {
          router.push("/(tabs)/routine");
        }}
      >
        <Text style={styles.primaryButtonText}>Start My Day</Text>
      </TouchableOpacity>

      {/* Alert */}
      <ThemedAlert
        visible={alertVisible}
        onClose={hideAlert}
        title={alertTitle}
        message={alertMsg}
        sex="boy"
      />
    </View>
  );
}

/* ---------------- FEELING BUBBLE ---------------- */
function Feeling({
  emoji,
  label,
  onPress,
}: {
  emoji: string;
  label: string;
  onPress: (value: string) => void;
}) {
  return (
    <View style={styles.feelingItem}>
      <TouchableOpacity onPress={() => onPress(label)}>
        <Text style={styles.feelingEmoji}>{emoji}</Text>
        <Text style={styles.feelingLabel}>{label}</Text>
      </TouchableOpacity>
    </View>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDEFFF",
    paddingHorizontal: 20,
    paddingTop: 60,
  },

  welcomeBox: {
    alignItems: "center",
    marginBottom: 25,
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    color: "#4F46E5",
  },
  subText: {
    marginTop: 8,
    fontSize: 16,
    color: "#6D6D9D",
    textAlign: "center",
  },

  primaryButton: {
    backgroundColor: "#4F46E5",
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#4F46E5",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    marginBottom: 30,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },

  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 12,
    color: "#3F3D56",
  },

  feelingsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  feelingItem: {
    alignItems: "center",
    width: 60,
  },
  feelingEmoji: {
    fontSize: 30,
  },
  feelingLabel: {
    fontSize: 12,
    marginTop: 4,
    color: "#444",
  },

  calmCard: {
    backgroundColor: "#DFF7EE",
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
  },
  calmTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0B7A55",
  },
  calmText: {
    marginTop: 6,
    color: "#126B4E",
  },

  feelingCard: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
  },
  feelingTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0B7A55",
  },
  feelingText: {
    marginTop: 6,
    color: "#126B4E",
  },

  routineCard: {
    backgroundColor: "#DFF7EE",
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
  },
  routineTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0B7A55",
  },
  routineText: {
    marginTop: 6,
    color: "#126B4E",
  },

  cardNeutral: {
    backgroundColor: "#DFF7EE",
  },

  cardStart: {
    backgroundColor: "#BFDBFE",
  },

  cardMid: {
    backgroundColor: "#FDE68A",
  },

  cardDone: {
    backgroundColor: "#A7F3D0",
  },
});
