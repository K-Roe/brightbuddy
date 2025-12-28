import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
<Tabs
  screenOptions={{
    headerShown: false,
    tabBarStyle: {
      height: 80,
      backgroundColor: "#141a29",
      paddingBottom: 10,
      paddingTop: 5,
      borderTopWidth: 0,
    },
    tabBarLabelStyle: {
      fontSize: 12,
      fontWeight: "bold",
    },
  }}
>
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={28} color={color} />
          ),
          tabBarActiveTintColor: "#7dd3fc",
        }}
      />

      <Tabs.Screen
        name="routine"
        options={{
          title: "Routine",
          tabBarIcon: ({ color }) => (
            <Ionicons name="list" size={28} color={color} />
          ),
          tabBarActiveTintColor: "#f9a8d4",
        }}
      />

      <Tabs.Screen
        name="feelings"
        options={{
          title: "Feelings",
          tabBarIcon: ({ color }) => (
            <Ionicons name="happy" size={28} color={color} />
          ),
          tabBarActiveTintColor: "#facc15",
        }}
      />

      <Tabs.Screen
        name="calm"
        options={{
          title: "Calm Corner",
          tabBarIcon: ({ color }) => (
            <Ionicons name="leaf" size={28} color={color} />
          ),
          tabBarActiveTintColor: "#a7f3d0",
        }}
      />

      <Tabs.Screen
        name="rewards"
        options={{
          title: "Rewards",
          tabBarIcon: ({ color }) => (
            <Ionicons name="star" size={28} color={color} />
          ),
          tabBarActiveTintColor: "#fcd34d",
        }}
      />
    </Tabs>
  );
}
