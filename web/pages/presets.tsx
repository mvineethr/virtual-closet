import { useState, useEffect } from 'react';
import Image from 'next/image';
import supabase from '../lib/supabaseClient';

interface Item {
  id: string;
  name: string;
  url: string;
}

interface Preset {
  id: number;
  name: string;
  items: Item[];
}

export default function PresetsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [presetName, setPresetName] = useState('');
  const [presets, setPresets] = useState<Preset[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchItems();
    fetchPresets();
  }, []);

  async function fetchItems() {
    setLoading(true);
    const { data, error } = await supabase.storage.from('closet').list('', {
      limit: 100,
      offset: 0,
      sortBy: { column: 'name', order: 'asc' },
    });
    if (!error && data) {
      const urls = await Promise.all(
        data.map(async file => {
          const { data: urlData } = supabase.storage.from('closet').getPublicUrl(file.name);
          return { id: file.name, name: file.name, url: urlData.publicUrl } as Item;
        })
      );
      setItems(urls);
    }
    setLoading(false);
  }

  async function fetchPresets() {
    const { data, error } = await supabase
      .from('presets')
      .select('*')
      .order('id', { ascending: false });
    if (!error && data) {
      const parsed = data.map(row => ({
        id: row.id,
        name: row.name,
        items: row.items as unknown as Item[],
      }));
      setPresets(parsed);
    }
  }

  async function handleSavePreset() {
    if (!presetName || selectedItems.length === 0) return;
    const presetItems: Item[] = items.filter(item => selectedItems.includes(item.id));
    await supabase.from('presets').insert([
      { name: presetName, items: presetItems },
    ]);
    setPresetName('');
    setSelectedItems([]);
    fetchPresets();
  }

  async function handleDeletePreset(id: number) {
    await supabase.from('presets').delete().eq('id', id);
    fetchPresets();
  }

  const toggleItem = (itemId: string) => {
    setSelectedItems(prev =>
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  return (
    <main className="p-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">Outfit Presets</h1>
      <p className="max-w-md text-center mb-4">
        Select items from your closet, give your preset a name, and save it. Presets are stored
        in Supabase so you can access them on any device.
      </p>
      {loading ? (
        <p>Loading items...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
          {items.map(item => (
            <div
              key={item.id}
              className={`flex flex-col items-center p-2 border rounded ${
                selectedItems.includes(item.id) ? 'border-blue-500' : ''
              }`}
              onClick={() => toggleItem(item.id)}
            >
              <Image src={item.url} alt={item.name} width={80} height={80} />
              <span className="text-xs mt-1 truncate max-w-full">{item.name}</span>
            </div>
          ))}
        </div>
      )}
      <div className="flex flex-col sm:flex-row items-center w-full max-w-md mb-6">
        <input
          type="text"
          placeholder="Preset name"
          value={presetName}
          onChange={e => setPresetName(e.target.value)}
          className="border p-2 rounded w-full sm:mr-2 mb-2 sm:mb-0"
        />
        <button
          onClick={handleSavePreset}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full sm:w-auto"
        >
          Save Preset
        </button>
      </div>
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-2">Saved Presets</h2>
        {presets.length === 0 && <p>No presets yet.</p>}
        {presets.map(preset => (
          <div key={preset.id} className="border p-3 rounded mb-3">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">{preset.name}</span>
              <button
                className="text-red-500 underline"
                onClick={() => handleDeletePreset(preset.id)}
              >
                Delete
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {preset.items.map(item => (
                <Image
                  key={item.id}
                  src={item.url}
                  alt={item.name}
                  width={40}
                  height={40}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}