import React from "react";
import { View, Text, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function Login() {
  const router = useRouter();

  async function setGender(gender) {
    await AsyncStorage.setItem("gender", gender);
    router.replace("/closet");
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>Virtual Closet</Text>
      <Text>Select a profile</Text>
      <Button title="Male" onPress={() => setGender("male")} />
      <Button title="Female" onPress={() => setGender("female")} />
    </View>
  );
}
