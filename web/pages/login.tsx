"use client";

import { useRouter } from "next/router";
import React from "react";

/**
 * Login page that allows the user to select a gender. The chosen gender is stored
 * in localStorage under the `gender` key. Once selected, the user is redirected
 * to the closet page. This is a simple demonstration login and does not use
 * Supabase authentication. In a real application, you would handle user
 * authentication and store additional user data (including gender) securely.
 */
export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (gender: "male" | "female") => {
    if (typeof window !== "undefined") {
      localStorage.setItem("gender", gender);
      // Optionally clear sample-loaded flag so sample items can be seeded again
      localStorage.removeItem("sampleLoaded");
    }
    // Redirect to closet after selecting gender
    router.push("/closet");
  };

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "1rem",
      }}
    >
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem" }}>
        Select Your Gender
      </h1>
      <p style={{ marginBottom: "1rem", textAlign: "center", maxWidth: 480 }}>
        Choose a gender to load sample wardrobe items. You can always upload your own
        clothing later. This demo login does not require a password.
      </p>
      <div style={{ display: "flex", gap: "1rem" }}>
        <button
          onClick={() => handleLogin("male")}
          style={{
            backgroundColor: "#0070f3",
            color: "white",
            padding: "0.75rem 1.5rem",
            borderRadius: "0.375rem",
            border: "none",
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          Login as Male
        </button>
        <button
          onClick={() => handleLogin("female")}
          style={{
            backgroundColor: "#8a4baf",
            color: "white",
            padding: "0.75rem 1.5rem",
            borderRadius: "0.375rem",
            border: "none",
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          Login as Female
        </button>
      </div>
    </main>
  );
}