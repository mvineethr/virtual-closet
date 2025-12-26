import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ScrollView, TextInput, Button } from 'react-native';
import supabase from '../supabaseClient';

const ZONES = ['top', 'bottom', 'shoes', 'outer', 'accessory'];

export default function MannequinScreen() {
  const [items, setItems] = useState([]);
  const [outfit, setOutfit] = useState({
    top: null,
    bottom: null,
    shoes: null,
    outer: null,
    accessory: null,
  });
  const [presetName, setPresetName] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
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
  }

  function assignItem(item, zone) {
    setOutfit(prev => ({ ...prev, [zone]: item }));
  }

  function removeItem(zone) {
    setOutfit(prev => ({ ...prev, [zone]: null }));
  }

  async function saveOutfitAsPreset() {
    if (!presetName) return;
    const outfitItems = Object.values(outfit).filter(Boolean);
    if (outfitItems.length === 0) return;
    await supabase.from('presets').insert([
      { name: presetName, items: outfitItems },
    ]);
    setPresetName('');
  }

  const renderItem = ({ item }) => (
    <View style={{ marginVertical: 8, alignItems: 'center' }}>
      <Image source={{ uri: item.url }} style={{ width: 80, height: 80 }} />
      <View style={{ flexDirection: 'row', marginTop: 4 }}>
        {ZONES.map((zone) => (
          <TouchableOpacity
            key={zone}
            onPress={() => assignItem(item, zone)}
            style={{ marginHorizontal: 4 }}
          >
            <Text style={{ color: '#0070f3', fontSize: 12 }}>
              {zone.charAt(0).toUpperCase() + zone.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={{ alignItems: 'center', padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 12 }}>
        Dress the Mannequin
      </Text>
      {items.length === 0 ? (
        <Text>Loading items...</Text>
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      )}
      <View style={{ marginTop: 16, width: '100%', maxWidth: 320 }}>
        <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 8 }}>
          Current Outfit
        </Text>
        {ZONES.map((zone) => (
          <View
            key={zone}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginVertical: 4,
            }}
          >
            <Text style={{ fontSize: 16 }}>
              {zone.charAt(0).toUpperCase() + zone.slice(1)}:
            </Text>
            {outfit[zone] ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ marginRight: 8 }}>{outfit[zone].name}</Text>
                <TouchableOpacity onPress={() => removeItem(zone)}>
                  <Text style={{ color: 'red' }}>Remove</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text>None</Text>
            )}
          </View>
        ))}
      </View>
      <TextInput
        value={presetName}
        onChangeText={setPresetName}
        placeholder="Preset name"
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 8,
          borderRadius: 4,
          marginTop: 12,
          width: '100%',
        }}
      />
      <Button
        title="Save Outfit as Preset"
        onPress={saveOutfitAsPreset}
        disabled={Object.values(outfit).every((val) => val === null) || !presetName}
      />
    </ScrollView>
  );
}