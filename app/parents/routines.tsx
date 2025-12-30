import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function RoutineSetup() {
  const [items, setItems] = useState<string[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    const data = await AsyncStorage.getItem("routineItems");
    if (data) setItems(JSON.parse(data));
  };

  const saveItems = async (list: string[]) => {
    setItems(list);
    await AsyncStorage.setItem("routineItems", JSON.stringify(list));
    await AsyncStorage.removeItem("routineProgress");
  };

  const addItem = () => {
    if (!text.trim()) return;
    const updated = [...items, text.trim()];
    saveItems(updated);
    setText("");
  };

  const deleteItem = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    saveItems(updated);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...items];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    saveItems(updated);
  };

  const moveDown = (index: number) => {
    if (index === items.length - 1) return;
    const updated = [...items];
    [updated[index + 1], updated[index]] = [updated[index], updated[index + 1]];
    saveItems(updated);
  };

  return (
    <FlatList
      style={styles.container}
      data={items}
      keyExtractor={(_, index) => index.toString()}
      ListHeaderComponent={
        <View>
          {/* Back */}
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Parent Routine Builder 👨‍👩‍👦</Text>

          {/* Add Row */}
          <View style={styles.row}>
            <TextInput
              style={styles.input}
              placeholder="Add routine item..."
              value={text}
              onChangeText={setText}
            />

            <TouchableOpacity style={styles.addBtn} onPress={addItem}>
              <Text style={styles.addText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      }
      renderItem={({ item, index }) => (
        <View style={styles.item}>
          <Text style={styles.itemText}>{item}</Text>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.moveBtn} onPress={() => moveUp(index)}>
              <Text style={styles.moveText}>⬆️</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.moveBtn} onPress={() => moveDown(index)}>
              <Text style={styles.moveText}>⬇️</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => deleteItem(index)}
            >
              <Text style={styles.deleteText}>X</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      ListFooterComponent={
        items.length === 0 ? (
          <Text style={{ marginTop: 20, color: "#666", textAlign: "center" }}>
            No routine items yet — add some 😊
          </Text>
        ) : (
          <View style={{ height: 60 }} />
        )
      }
      contentContainerStyle={{ paddingBottom: 50 }}
    />
  );
}

/* -------- STYLES -------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  backBtn: { marginBottom: 10 },
  backText: {
    fontSize: 18,
    color: "#4F46E5",
    fontWeight: "700",
  },

  title: {
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 20,
  },

  row: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginBottom: 10,
  },

  input: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  addBtn: {
    backgroundColor: "#4F46E5",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  addText: { color: "white", fontWeight: "800" },

  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    marginTop: 12,
    backgroundColor: "#E9EDFF",
    borderRadius: 14,
  },

  itemText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
  },

  actions: {
    flexDirection: "row",
    gap: 8,
  },

  moveBtn: {
    backgroundColor: "#A5B4FC",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  moveText: {
    fontSize: 18,
  },

  deleteBtn: {
    backgroundColor: "#EF4444",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  deleteText: {
    color: "white",
    fontWeight: "800",
  },
});
