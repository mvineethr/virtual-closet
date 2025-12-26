import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import supabase from '../lib/supabaseClient';
import Mannequin from '../components/Mannequin';

interface Item {
  id: string;
  name: string;
  url: string;
}

export type OutfitZone = 'top' | 'bottom' | 'shoes' | 'outer' | 'accessory';

interface OutfitState {
  top: Item | null;
  bottom: Item | null;
  shoes: Item | null;
  outer: Item | null;
  accessory: Item | null;
}

const MannequinPage: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [outfit, setOutfit] = useState<OutfitState>({
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
    const { data, error } = await supabase.storage
      .from('closet')
      .list('', { limit: 100, offset: 0, sortBy: { column: 'name', order: 'asc' } });
    if (!error && data) {
      const urls = await Promise.all(
        data
          .filter(file => file)
          .map(async file => {
            const { data: urlData } = supabase.storage.from('closet').getPublicUrl(file.name);
            return {
              id: file.name,
              name: file.name,
              url: urlData.publicUrl,
            } as Item;
          })
      );
      setItems(urls);
    }
  }

  const handleAssign = (item: Item, zone: OutfitZone) => {
    setOutfit(prev => ({ ...prev, [zone]: item }));
  };

  const handleRemove = (zone: OutfitZone) => {
    setOutfit(prev => ({ ...prev, [zone]: null }));
  };

  async function saveOutfitAsPreset() {
    if (!presetName) return;
    const outfitItems = (Object.values(outfit) as (Item | null)[]).filter(Boolean) as Item[];
    if (outfitItems.length === 0) return;
    await supabase.from('presets').insert([
      { name: presetName, items: outfitItems },
    ]);
    setPresetName('');
  }

  return (
    <main className="flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-4">Dress the Mannequin</h1>
      <div className="w-full max-w-md h-96">
        <Mannequin />
        <div className="relative w-full h-full pointer-events-none">
          {outfit.outer && (
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-40">
              <Image src={outfit.outer.url} alt="Outer" width={160} height={160} />
            </div>
          )}
          {outfit.top && (
            <div className="absolute top-24 left-1/2 transform -translate-x-1/2 w-32">
              <Image src={outfit.top.url} alt="Top" width={128} height={128} />
            </div>
          )}
          {outfit.bottom && (
            <div className="absolute top-48 left-1/2 transform -translate-x-1/2 w-32">
              <Image src={outfit.bottom.url} alt="Bottom" width={128} height={128} />
            </div>
          )}
          {outfit.shoes && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-24">
              <Image src={outfit.shoes.url} alt="Shoes" width={96} height={96} />
            </div>
          )}
          {outfit.accessory && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-20">
              <Image src={outfit.accessory.url} alt="Accessory" width={80} height={80} />
            </div>
          )}
        </div>
      </div>
      <h2 className="text-2xl font-semibold mt-8">Select an item and assign to a zone</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
        {items.map(item => (
          <div key={item.id} className="flex flex-col items-center border p-2 rounded">
            <Image src={item.url} alt={item.name} width={80} height={80} className="rounded" />
            <select
              className="mt-2 border p-1 rounded"
              onChange={e => {
                const zone = e.target.value as OutfitZone;
                if (zone) handleAssign(item, zone);
              }}
              defaultValue=""
            >
              <option value="" disabled>Assign...</option>
              <option value="top">Top</option>
              <option value="bottom">Bottom</option>
              <option value="shoes">Shoes</option>
              <option value="outer">Outerwear</option>
              <option value="accessory">Accessory</option>
            </select>
          </div>
        ))}
      </div>
      <div className="mt-8 w-full max-w-md">
        <h3 className="text-xl font-bold mb-2">Current Outfit</h3>
        {(['top','bottom','shoes','outer','accessory'] as OutfitZone[]).map(zone => (
          <div key={zone} className="flex justify-between items-center border p-2 rounded mb-2">
            <span className="capitalize">{zone}: {outfit[zone]?.name || 'None'}</span>
            {outfit[zone] && (
              <button className="text-red-500 underline" onClick={() => handleRemove(zone)}>
                Remove
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 w-full max-w-md">
        <input
          type="text"
          placeholder="Preset name"
          value={presetName}
          onChange={e => setPresetName(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          onClick={saveOutfitAsPreset}
          disabled={(Object.values(outfit).filter(Boolean).length === 0) || !presetName}
        >
          Save Outfit as Preset
        </button>
      </div>
    </main>
  );
};

export default MannequinPage;