import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import RoutineItem from "../../components/RoutineItem";

export default function Routine() {
  const defaultItems = [
    "Wake Up and Stretch",
    "Brush Teeth",
    "Get Dressed",
    "Eat Breakfast",
    "Pack Bag for School",
    "Review Daily Goals",
  ];

  const [routineItems, setRoutineItems] = useState<string[]>(defaultItems);
  const [completed, setCompleted] = useState<boolean[]>(
    new Array(defaultItems.length).fill(false)
  );

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    loadItemsAndProgress();
  }, []);

  const loadItemsAndProgress = async () => {
    try {
      const savedItems = await AsyncStorage.getItem("routineItems");
      let items = defaultItems;

      if (savedItems) {
        items = JSON.parse(savedItems);
        setRoutineItems(items);
      } else {
        setRoutineItems(defaultItems);
      }

      const data = await AsyncStorage.getItem("routineProgress");
      if (!data) {
        setCompleted(new Array(items.length).fill(false));
        return;
      }

      const parsed = JSON.parse(data);

      if (parsed.date !== today) {
        await AsyncStorage.removeItem("routineProgress");
        setCompleted(new Array(items.length).fill(false));
        return;
      }

      if (!parsed.items || parsed.items.length !== items.length) {
        await AsyncStorage.removeItem("routineProgress");
        setCompleted(new Array(items.length).fill(false));
        return;
      }

      setCompleted(parsed.items);
    } catch (e) {
      console.log("Failed to load routine items/progress", e);
    }
  };

  const updateStatus = async (index: number, done: boolean) => {
    const copy = [...completed];
    copy[index] = done;
    setCompleted(copy);

    const totalDone = copy.filter(Boolean).length;

    await AsyncStorage.setItem(
      "routineProgress",
      JSON.stringify({
        date: today,
        items: copy,
        completed: totalDone,
        total: routineItems.length,
      })
    );
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
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
          defaultCompleted={completed[index]}
          onStatusChange={(done) => updateStatus(index, done)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 40,
    paddingBottom: 80,
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
