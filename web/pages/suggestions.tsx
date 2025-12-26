import { useEffect, useState } from 'react';
import Image from 'next/image';
import supabase from '../lib/supabaseClient';

interface Item {
  id: string;
  name: string;
  url: string;
}

/**
 * AI Suggestions page.  This page pulls the user's closet items from Supabase
 * storage and offers a simple button to generate a few outfit suggestions.
 * Suggestions are currently randomly selected from the available items.  If
 * weather‑based logic is desired, you can extend this page to fetch weather
 * data and filter items accordingly.  The generated suggestions are displayed
 * with their images and names.
 */
export default function SuggestionsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [suggestions, setSuggestions] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  // Fetch the list of images from the Supabase storage bucket.  The closet
  // bucket must be public or have appropriate read policies configured.
  async function fetchItems() {
    setLoading(true);
    try {
      const { data, error } = await supabase.storage.from('closet').list('', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' },
      });
      if (!error && data) {
        const urls = await Promise.all(
          data.map(async (file) => {
            const { data: urlData } = supabase.storage.from('closet').getPublicUrl(file.name);
            return { id: file.name, name: file.name, url: urlData.publicUrl } as Item;
          }),
        );
        setItems(urls);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Randomly select up to three items from the user's closet.  This can be
  // extended to include weather‑based logic by fetching weather data and
  // filtering the available items.
  function generateSuggestions() {
    if (items.length === 0) return;
    const shuffled = [...items].sort(() => 0.5 - Math.random());
    const count = Math.min(3, shuffled.length);
    setSuggestions(shuffled.slice(0, count));
  }

  return (
    <main className="p-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">AI Suggestions</h1>
      <p className="max-w-md text-center mb-4">
        Click the button below to generate a few outfit suggestions from your closet. The
        suggestions are randomly selected from your uploaded items.  Future versions of
        this page can incorporate weather and context to provide smarter suggestions.
      </p>
      <button
        onClick={generateSuggestions}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
        disabled={loading || items.length === 0}
      >
        {loading ? 'Loading…' : 'Generate Suggestions'}
      </button>
      {suggestions.length > 0 && (
        <div className="w-full max-w-md border p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Suggestions</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            {suggestions.map((item) => (
              <div key={item.id} className="flex flex-col items-center">
                <Image src={item.url} alt={item.name} width={80} height={80} />
                <span className="text-sm mt-2 truncate max-w-full text-center">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      {items.length === 0 && !loading && (
        <p className="mt-4 text-center">No items found in your closet. Try uploading some items first.</p>
      )}
    </main>
  );
}