import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerTitleAlign: "center" }}>
      <Stack.Screen name="login" options={{ title: "Login" }} />
      <Stack.Screen name="closet" options={{ title: "Closet" }} />
      <Stack.Screen name="mannequin" options={{ title: "Mannequin" }} />
      <Stack.Screen name="presets" options={{ title: "Presets" }} />
      <Stack.Screen name="suggestions" options={{ title: "Suggestions" }} />
    </Stack>
  );
}
