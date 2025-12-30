import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Input from "../components/input";
import { getChildTheme } from "./theme/childTheme";


// ⭐ NEW ALERT
import ThemedAlert from "../components/ThemedAlert";
import { useThemedAlert } from "./hooks/useThemedAlert";


export default function PinLogin() {
  const [pin, setPin] = useState("");
  const [themeColor, setThemeColor] = useState("neutral");
  const [sex, setSex] = useState("");

    // ⭐ ALERT HOOK
    const { alertVisible, alertTitle, alertMsg, showAlert, hideAlert } =
    useThemedAlert();
    
  useEffect(() => {
  
    const loadTheme = async () => {
      try {
        const saved = await AsyncStorage.getItem("childProfile");
        if (saved) {
          const profile = JSON.parse(saved);
          setThemeColor(profile.themeColor || "neutral");
          setSex(profile.sex || "boy");
        } else {
          setThemeColor("neutral");
        }
      } catch (e) {
        setThemeColor("neutral");
      }
    };

    loadTheme();
  }, []);

  const theme = getChildTheme(themeColor);

  const checkPin = async () => {
    const savedPin = await AsyncStorage.getItem("parentPin");

    if (!savedPin) {
      showAlert("Alert!","No PIN set yet. You need to create one first.");
      router.push("/pin-setup");
      return;
    }

    if (pin === savedPin) {
      setPin("");
      router.push("/parent-settings");
    } else {
      showAlert("Alert!","Incorrect PIN");
      setPin("");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <Text style={[styles.title, { color: theme.title }]}>Parent Access</Text>
      <Text style={[styles.subtitle, { color: theme.label }]}>
        Enter your PIN
      </Text>

      {/* If your Input component supports style props, you can pass them here too */}
      <Input
        placeholder="PIN"
        value={pin}
        onChangeText={setPin}
        keyboardType="number-pad"
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.buttonBg }]}
        onPress={checkPin}
      >
        <Text style={styles.buttonText}>Enter</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.buttonBg }]}
        onPress={() => router.push("/")}
      >
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
       {/* ⭐ NEW THEMED ALERT */}
            <ThemedAlert
              visible={alertVisible}
              onClose={hideAlert}
              title={alertTitle}
              message={alertMsg}
              sex={sex}
            />
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    marginBottom: 10,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 25,
    fontWeight: "600",
    opacity: 0.85,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginTop: 20,
    minWidth: "70%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
