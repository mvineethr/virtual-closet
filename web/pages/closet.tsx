import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';

interface StorageFile {
  name: string;
  id?: string;
}

export default function Closet() {
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [urls, setUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch a listing of all files in the closet bucket and derive
  // publicly accessible URLs from them.  This is called on mount
  // and after successful uploads.
  const fetchFiles = useCallback(async () => {
    const { data, error } = await supabase.storage.from('closet').list('');
    if (error) {
      setError(error.message);
      return;
    }
    setFiles(data || []);
    const publicUrls = (data || []).map((f) => {
      const { data: publicUrlData } = supabase.storage
        .from('closet')
        .getPublicUrl(f.name);
      return publicUrlData.publicUrl;
    });
    setUrls(publicUrls);
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  // Handle the file upload triggered from the file input element.
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    const fileName = `${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('closet')
      .upload(fileName, file);
    setUploading(false);
    if (uploadError) {
      setError(uploadError.message);
      return;
    }
    await fetchFiles();
  };

  return (
    <main style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>My Closet</h1>
      <p style={{ marginBottom: '1rem' }}>
        Upload items to your closet and view them here. Make sure you have
        configured a public storage bucket named <code>closet</code> in your
        Supabase project. Each item will be stored in that bucket.
      </p>
      <div style={{ marginBottom: '1rem' }}>
        <label
          htmlFor="file"
          style={{
            display: 'inline-block',
            padding: '0.5rem 1rem',
            backgroundColor: '#0070f3',
            color: '#fff',
            borderRadius: '0.25rem',
            cursor: uploading ? 'not-allowed' : 'pointer',
            opacity: uploading ? 0.6 : 1,
          }}
        >
          {uploading ? 'Uploading…' : 'Select Image'}
        </label>
        <input
          id="file"
          type="file"
          accept="image/*"
          onChange={handleUpload}
          style={{ display: 'none' }}
          disabled={uploading}
        />
        <Link
          href="/"
          style={{ marginLeft: '1rem', color: '#0070f3', textDecoration: 'underline' }}
        >
          Back to home
        </Link>
      </div>
      {error && (
        <div
          style={{ backgroundColor: '#fee', color: '#c00', padding: '0.5rem', borderRadius: '0.25rem', marginBottom: '1rem' }}
        >
          {error}
        </div>
      )}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '1rem',
        }}
      >
        {urls.map((url, index) => (
          <div key={url} style={{ border: '1px solid #ddd', borderRadius: '0.25rem', padding: '0.25rem' }}>
            <Image src={url} alt={`Closet item ${index + 1}`} width={150} height={150} style={{ objectFit: 'cover' }} />
          </div>
        ))}
      </div>
    </main>
  );
}