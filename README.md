# Virtual Closet & AI Stylist

This repository hosts the initial scaffold for a virtual closet platform with both web and mobile clients.

The goal of this project is to create a clean, minimal and powerful application where users can upload clothes, organise them into a virtual closet, assemble outfits on a mannequin, and receive AI‐driven outfit suggestions based on occasion, location and weather. The long‑term plan includes a web experience built with **Next.js** and a mobile app built with **Expo (React Native)**, backed by a free‑tier backend such as **Supabase**.

## Project structure

```
virtual-closet/
│
├── README.md        # this file
│
├── web/             # Next.js (web) client
│   ├── package.json
│   ├── next.config.js
│   ├── pages/
│   │   ├── _app.tsx
│   │   └── index.tsx
│   └── public/
│       └── placeholder.jpg
│
└── mobile/          # Expo (React Native) client
    ├── package.json
    ├── app.json
    └── App.js
```

### Web client (`/web`)

The web client uses **Next.js** to provide a server‑rendered React experience. The initial scaffold includes a simple home page with placeholder content. Tailwind CSS is not configured yet; you can add it later to achieve the minimalistic design.

Key files:

- **`pages/index.tsx`** – The landing page for the web app. It currently displays a logo and a brief welcome message. Extend this page to show the closet grid, outfit builder and assistant tabs.
- **`pages/_app.tsx`** – Custom top‑level component where you can import global styles or wrap pages in context providers (e.g. for Supabase or a theme).
- **`next.config.js`** – A basic configuration enabling React strict mode. Additional configuration (e.g. image domains, API routes) can be added here as the project evolves.
- **`public/placeholder.jpg`** – A sample image used on the home page until users upload their own clothes.

### Mobile client (`/mobile`)

The mobile client uses **Expo** to bootstrap a React Native app. The initial scaffold renders a simple welcome screen. The project structure is kept flat for now; as the app grows you can organise components and screens in subdirectories.

Key files:

- **`App.js`** – The entry point for the Expo app. Currently displays a welcome message. This is where you will implement navigation tabs (Closet, Build, Presets, Assistant) and integrate features.
- **`app.json`** – Configuration file for the Expo project. It sets the name, slug and other metadata. Update these fields to match your project’s details.
- **`package.json`** – Defines dependencies and scripts. At this stage it includes only the minimal dependencies. When you add libraries (e.g. `react-navigation`, `expo-av` for voice), they should be declared here.

## Running locally

> **Prerequisite:** Ensure you have **Node.js** (preferably the LTS version) installed. For the mobile app, you will also need **Expo CLI** (`npm install -g expo-cli`) and a device or simulator/emulator.

### Web

1. Navigate to the `web` directory:

   ```bash
   cd virtual-closet/web
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

   Open your browser at `http://localhost:3000` to see the web app.

### Mobile

1. Navigate to the `mobile` directory:

   ```bash
   cd virtual-closet/mobile
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Launch the app with Expo:

   ```bash
   expo start
   ```

   Follow the on‑screen instructions to run the app on a simulator or a real device using the Expo Go app.

## Next steps

This is a starting point. Here are suggested next steps for development:

1. **Authentication & database:** Set up a Supabase project (free tier) and integrate authentication. Create tables for `users`, `items` (clothing), and `outfits` with appropriate fields (type, color, photo URL, tags, etc.).
2. **Image upload & background removal:** Implement file uploads to Supabase Storage. Use a free API or library (e.g. `remove.bg`'s free tier or OpenCV) to remove backgrounds from clothing images.
3. **Closet grid UI:** Display uploaded items in a responsive grid. Add filtering by type, colour or occasion.
4. **Outfit builder:** Use Three.js or Babylon.js for a 3D mannequin view. Allow users to drag items onto the mannequin and save outfits. For the MVP, using 2D cutouts layered on a 3D mannequin provides a “3D feel” without complex model generation.
5. **AI assistant:** Start with rule‑based logic for outfit suggestions (matching occasion, weather and colour). Later, integrate a lightweight language model or connect to a hosted model when the budget allows. Implement both text and voice interfaces using browser APIs and Expo’s speech modules.
6. **Responsive design:** Incorporate Tailwind CSS on the web and style the mobile app to achieve a clean, minimalistic look. Keep the UI uncluttered by using tabs and bottom sheets for secondary actions.

Feel free to modify, extend and refine this scaffold to match your exact vision. Enjoy building your virtual closet!