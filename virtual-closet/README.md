# Virtual Closet & AI Stylist

This repository contains both web (Next.js) and mobile (Expo) clients for a virtual closet and AI stylist experience. Users can upload clothing images, manage outfits, and get basic voice feedback in the mobile app.

## Project layout

```
virtual-closet/
├── web/        # Next.js client (React + TypeScript)
└── mobile/     # Expo client (React Native)
```

## Prerequisites

- Node.js (LTS recommended)
- For mobile: Expo CLI (`npm install -g expo-cli`) and a device or simulator/emulator
- Supabase project with a `closet` storage bucket (for uploads)

## Setup

### Web
```bash
cd virtual-closet/web
npm install
npm run dev
```
Open http://localhost:3000

### Mobile
```bash
cd virtual-closet/mobile
npm install
expo start
```
Scan the QR code with Expo Go or launch an emulator.

Set these env vars for Supabase (Expo uses the `EXPO_PUBLIC_` prefix):
```
EXPO_PUBLIC_SUPABASE_URL=your-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Notes and next steps

- Integrate Supabase auth and database tables for items/outfits.
- Add image upload and background removal in the web client.
- Build the closet grid, mannequin/outfit builder, and AI suggestion flows.
- Style with Tailwind (web) and a consistent design system (mobile).
