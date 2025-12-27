import React, { useCallback, useEffect, useState } from 'react';
<<<<<<< HEAD
import { StyleSheet, Text, View, Button, FlatList, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
=======
import { StyleSheet, Text, View, Button, FlatList, Image, ActivityIndicator } from 'react-native';
>>>>>>> e7e72862 (adding updates and changes)
import * as ImagePicker from 'expo-image-picker';
import * as Speech from 'expo-speech';
import { supabase } from './supabaseClient';

/**
 * The main mobile application component.  This screen allows users to
 * select images from their device, upload them to a Supabase storage
 * bucket, view uploaded items, and trigger a basic voice synthesis
 * describing how many items are in their closet.  Voice feedback is
 * optional and can be triggered via the speak button.
 */
export default function App() {
  const [urls, setUrls] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Fetch list of images from Supabase and derive public URLs
  const fetchImages = useCallback(async () => {
    setRefreshing(true);
    try {
      const { data, error } = await supabase.storage.from('closet').list('');
      if (error) {
        setError(error.message);
        setRefreshing(false);
        return;
      }
      const urls = (data || []).map((f) => {
        const { data: publicUrlData } = supabase.storage.from('closet').getPublicUrl(f.name);
        return publicUrlData.publicUrl;
      });
      setUrls(urls);
    } catch (err) {
      setError(err.message);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  // Pick an image from the device and upload it to Supabase
  const pickAndUpload = async () => {
    setError(null);
    // Ask for media library permissions
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      setError('Permission to access media library is required.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (result.canceled) {
      return;
    }
    const file = result.assets[0];
    try {
      const response = await fetch(file.uri);
      const blob = await response.blob();
      const fileName = `${Date.now()}-${file.uri.split('/').pop()}`;
      setUploading(true);
      const { error: uploadError } = await supabase.storage.from('closet').upload(fileName, blob);
      setUploading(false);
      if (uploadError) {
        setError(uploadError.message);
        return;
      }
      await fetchImages();
    } catch (err) {
      setUploading(false);
      setError(err.message);
    }
  };

  // Use Expo Speech to read out how many items are in the closet
  const speakSummary = () => {
    const count = urls.length;
    const message = count === 0
      ? 'Your closet is empty. Try uploading some items.'
      : `You have ${count} item${count === 1 ? '' : 's'} in your closet.`;
    Speech.speak(message);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Virtual Closet</Text>
      <Text style={styles.subtitle}>Upload clothes, view your items and get spoken feedback.</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <View style={styles.buttonRow}>
<<<<<<< HEAD
        <Button title={uploading ? 'Uploading…' : 'Pick Image'} onPress={pickAndUpload} disabled={uploading} />
=======
        <Button title={uploading ? 'Uploading...' : 'Pick Image'} onPress={pickAndUpload} disabled={uploading} />
>>>>>>> e7e72862 (adding updates and changes)
        <Button title="Speak" onPress={speakSummary} />
      </View>
      {refreshing && <ActivityIndicator style={{ marginVertical: 10 }} />}
      <FlatList
        data={urls}
        keyExtractor={(item) => item}
        numColumns={2}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.itemImage} />
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
  },
  error: {
    color: '#c00',
    marginBottom: 8,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  itemImage: {
    width: '45%',
    height: 150,
    margin: '2.5%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
<<<<<<< HEAD
});
=======
});
>>>>>>> e7e72862 (adding updates and changes)
