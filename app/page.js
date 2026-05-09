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
    <main className="h-screen w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory bg-black text-white no-scrollbar">
      {/* Section 1: Categorization Board */}
      <section className="h-screen w-full snap-start flex flex-col relative pt-8 pb-4 px-6">
        
        {/* Search Bar floats at the top center */}
        <div className="flex-none z-50 mb-6 flex justify-center">
          <SearchBar onAddMovie={handleAddMovie} />
        </div>

        {/* The Board takes the rest of the height */}
        <div className="flex-1 min-h-0 w-full max-w-7xl mx-auto flex flex-col">
          <DragDropBoard items={items} setItems={setItems} />
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-50 animate-bounce cursor-pointer" onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}>
          <span className="text-xs tracking-widest uppercase mb-2">Scroll for AI</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
        </div>
      </section>

      {/* Section 2: Recommendation Engine */}
      <section className="h-screen w-full snap-start flex flex-col items-center justify-center relative p-6">
        <div className="w-full max-w-7xl mx-auto">
          <RecommendationSection items={items} />
        </div>
      </section>
    </main>
  );
}
