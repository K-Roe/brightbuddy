import { useEffect, useRef } from "react";
import {
  Animated,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ThemedAlert({
  visible,
  onClose,
  title,
  message,
  sex, // still here in case you use it later
}: {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  sex: string;
}) {
  const slideAnim = useRef(new Animated.Value(50)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 50,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="none">
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.box,
            {
              transform: [{ translateY: slideAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          <Text style={styles.title}>{title}</Text>

          <Text style={styles.message}>{message}</Text>

          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  box: {
    width: "100%",
    borderRadius: 22,
    padding: 26,
    alignItems: "center",
    elevation: 6,

    // Calm therapy-style colours
    backgroundColor: "#FFFFFF",

    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#4F46E5",
    marginBottom: 8,
    textAlign: "center",
  },

  message: {
    fontSize: 16,
    color: "#4B5563",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },

  button: {
    paddingVertical: 12,
    paddingHorizontal: 34,
    borderRadius: 14,
    backgroundColor: "#4F46E5",
  },

  buttonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
});
