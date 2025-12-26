import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const linkStyle: React.CSSProperties = {
    marginTop: '0.5rem',
    color: '#0070f3',
    textDecoration: 'underline',
  };

  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '1rem',
      }}
    >
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        Virtual Closet
      </h1>

      {/* Login link for quick access to select a user gender.  The login
          page allows you to choose between male and female test accounts. */}
      <Link href="/login" style={{ position: 'absolute', top: 16, right: 16, color: '#0070f3', textDecoration: 'underline' }}>
        Login
      </Link>

      <p style={{ fontSize: '1.1rem', textAlign: 'center', maxWidth: 640 }}>
        Upload your clothes, build outfit presets, try outfits on a mannequin,
        and get suggestions based on weather.
      </p>

      <div style={{ marginTop: '1.5rem' }}>
        <Image
          src="/placeholder.jpg"
          alt="Placeholder clothing"
          width={320}
          height={320}
          style={{ objectFit: 'cover', borderRadius: 12 }}
        />
      </div>

      <Link href="/closet" style={{ ...linkStyle, marginTop: '1rem' }}>
        Go to Closet
      </Link>
      <Link href="/presets" style={linkStyle}>
        Go to Presets
      </Link>
      <Link href="/mannequin" style={linkStyle}>
        Go to Mannequin
      </Link>
      <Link href="/suggestions" style={linkStyle}>
        Go to Suggestions
      </Link>
    </main>
  );
}