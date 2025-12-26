import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import { speak } from 'expo-speech';
import supabase from '../supabaseClient';

function getRandomItems(array, count) {
  const shuffled = array.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export default function SuggestionsScreen() {
  const [items, setItems] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    setLoading(true);
    const { data, error } = await supabase.storage.from('closet').list('', {
      limit: 100,
      offset: 0,
      sortBy: { column: 'name', order: 'asc' },
    });
    if (!error && data) {
      const itemsWithUrls = await Promise.all(
        data.map(async (file) => {
          const { data: urlData } = supabase.storage.from('closet').getPublicUrl(file.name);
          return {
            id: file.name,
            name: file.name,
            url: urlData.publicUrl,
          };
        })
      );
      setItems(itemsWithUrls);
    }
    setLoading(false);
  }

  async function getCurrentTemperature() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return null;
      const location = await Location.getCurrentPositionAsync({});
      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude;
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&timezone=UTC`
      );
      const data = await response.json();
      return data?.current?.temperature_2m ?? null;
    } catch {
      return null;
    }
  }

  async function generateSuggestions() {
    if (items.length === 0) return;
    const temperature = await getCurrentTemperature();
    const includeOuter = temperature !== null ? temperature < 15 : false;
    const availableItems = [...items];
    let selected = getRandomItems(availableItems, 3);
    if (includeOuter) {
      const outerwear = availableItems.find(item =>
        item.name.toLowerCase().includes('jacket') ||
        item.name.toLowerCase().includes('coat')
      );
      if (outerwear) {
        selected = [outerwear, ...selected].slice(0, 3);
      }
    }
    setSuggestions(selected);
    const names = selected.map(item => item.name).join(', ');
    const weatherText = temperature !== null ? `The current temperature is ${Math.round(temperature)} degrees. ` : '';
    speak(`${weatherText}Here are some outfit suggestions: ${names}.`);
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 12 }}>
        AI Suggestions
      </Text>
      <Text style={{ fontSize: 16, marginBottom: 8 }}>
        Tap the button below to generate outfit suggestions based on your closet and current location.
      </Text>
      <Button title="Generate Suggestions" onPress={generateSuggestions} disabled={loading || items.length === 0} />
      <View style={{ marginTop: 16 }}>
        {suggestions.length > 0 && (
          <>
            <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8 }}>
              Suggestions:
            </Text>
            {suggestions.map(item => (
              <View
                key={item.id}
                style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}
              >
                <Image source={{ uri: item.url }} style={{ width: 40, height: 40, marginRight: 8 }} />
                <Text>{item.name}</Text>
              </View>
            ))}
          </>
        )}
      </View>
    </ScrollView>
  );
}