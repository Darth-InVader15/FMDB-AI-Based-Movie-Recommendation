'use client';

import React, { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import DragDropBoard from '@/components/DragDropBoard';
import RecommendationSection from '@/components/RecommendationSection';

const DEFAULT_ITEMS = {
  loved: [],
  liked: [],
  ok: [],
  not_for_me: [],
};

export default function Home() {
  const [items, setItems] = useState(DEFAULT_ITEMS);
  const isFirstRender = React.useRef(true);

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('movie_recommender_state');
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to parse local storage', e);
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    localStorage.setItem('movie_recommender_state', JSON.stringify(items));
  }, [items]);

  const handleAddMovie = (movie) => {
    // By default, add to "Loved" or perhaps "Liked" so they can drag it elsewhere
    // Let's check if it already exists anywhere to prevent duplicates
    const exists = Object.values(items).some(list => 
      list.find(m => m.id === movie.id)
    );

    if (exists) return; // Prevent duplicates

    setItems(prev => ({
      ...prev,
      ok: [movie, ...prev.ok] // Add to 'ok' as a neutral starting point
    }));
  };


  return (
    <main className="min-h-screen pt-12 pb-24 container">
      {/* Header */}
      <header className="mb-12 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">
          Next Watch
        </h1>
        <p className="text-gray-400">
          Search for movies and series, drag them into categories based on your taste, 
          and let AI figure out exactly what you should watch next.
        </p>
      </header>

      {/* Search Bar */}
      <div className="mb-12">
        <SearchBar onAddMovie={handleAddMovie} />
      </div>

      {/* Board */}
      <div className="mb-8">
        <DragDropBoard items={items} setItems={setItems} />
      </div>

      {/* Recommendation Section */}
      <RecommendationSection items={items} />
    </main>
  );
}
