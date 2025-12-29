import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import RoutineItem from "../../components/RoutineItem";

export default function Routine() {
  const routineItems = [
    "Wake Up and Stretch",
    "Brush Teeth",
    "Get Dressed",
    "Eat Breakfast",
    "Pack Bag for School",
    "Review Daily Goals",
  ];

  const [completed, setCompleted] = useState(
    new Array(routineItems.length).fill(false)
  );

  const updateStatus = async (index: number, done: boolean) => {
    const copy = [...completed];
    copy[index] = done;
    setCompleted(copy);

    const totalDone = copy.filter(Boolean).length;

    // save to storage
    await AsyncStorage.setItem(
      "routineProgress",
      JSON.stringify({
        completed: totalDone,
        total: routineItems.length,
      })
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.welcomeBox}>
        <Text style={styles.title}>Routine 😊</Text>
        <Text style={styles.subText}>
          Let’s get started with your morning routine!
        </Text>
      </View>

      {routineItems.map((item, index) => (
        <RoutineItem
          key={index}
          label={item}
          onStatusChange={(done) => updateStatus(index, done)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
});
