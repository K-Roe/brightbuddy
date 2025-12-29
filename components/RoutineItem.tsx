import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type RoutineItemProps = {
  label: string;
  defaultCompleted?: boolean;
  onStatusChange?: (completed: boolean) => void;
};

export default function RoutineItem({
  label,
  defaultCompleted = false,
  onStatusChange,
}: RoutineItemProps) {
  const [completed, setCompleted] = useState(defaultCompleted);

  const toggle = (state: boolean) => {
    setCompleted(state);
    onStatusChange && onStatusChange(state);
  };

  return (
    <View
      style={[
        styles.container,
        completed ? styles.completedBackground : styles.notCompletedBackground,
      ]}
    >
      <Text style={styles.label}>{label}</Text>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.completeBtn]}
          onPress={() => toggle(true)}
          accessibilityLabel="Mark as done"
        >
          <Text style={styles.icon}>✔️</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.notCompleteBtn]}
          onPress={() => toggle(false)}
          accessibilityLabel="Mark as not done"
        >
          <Text style={styles.icon}>❌</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "90%",
    borderRadius: 18,
    padding: 16,
    marginVertical: 10,
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    // gentle shadow
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },

  completedBackground: {
    backgroundColor: "#A7F3D0", // calm soft green
  },

  notCompletedBackground: {
    backgroundColor: "#BFDBFE", // soft friendly blue
  },

  label: {
    fontSize: 18,
    fontWeight: "600",
    color: "#063970",
  },

  actions: {
    flexDirection: "row",
    gap: 10,
  },

  button: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  completeBtn: {
    backgroundColor: "#10B981",
  },

  notCompleteBtn: {
    backgroundColor: "#F87171",
  },

  icon: {
    fontSize: 26,
  },
});

/**
 * Routine Item Component
 * <RoutineItem label="Brush Teeth" />
 */