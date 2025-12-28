import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Index() {


  return (
    <View style={styles.container}>


      <View style={styles.header}>
        <TouchableOpacity>
          <Text style={styles.appName}>BrightBuddy</Text>
        </TouchableOpacity>

        <Text style={styles.tagline}>Helping every voice shine</Text>
      </View>

      {/* <Image
        source={require("../assets/images/indexLogo.png")}
        style={styles.image}
      /> */}

      <TouchableOpacity
        style={styles.mainButton}
      onPress={() => router.push("/(tabs)/home")}
      >
        <Text style={styles.mainButtonText}>Start Talking</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ECECFF",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  // Invisible long-press zone
  hiddenParent: {
    height: 1,
    width: 1,
  },

  header: {
    alignItems: "center",
    marginBottom: 30,
  },

  appName: {
    fontSize: 42,
    fontWeight: "900",
    color: "#4F46E5",
    textAlign: "center",
    textShadowColor: "rgba(79,70,229,0.25)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 12,
    letterSpacing: 1,
  },

  tagline: {
    fontSize: 16,
    color: "#6D6D9D",
    marginTop: 8,
  },

  image: {
    width: 190,
    height: 190,
    marginBottom: 50,
  },

  mainButton: {
    backgroundColor: "#4F46E5",
    paddingVertical: 18,
    paddingHorizontal: 50,
    borderRadius: 20,
    marginTop: 10,
    elevation: 3,
  },

  mainButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
});
