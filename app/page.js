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
  const [isLoading, setIsLoading] = useState(true);
  const isFirstRender = React.useRef(true);

  // Load from DB
  useEffect(() => {
    async function loadBoard() {
      try {
        const res = await fetch('/api/db/board');
        if (res.ok) {
          const data = await res.json();
          // Merge fetched items with default structure to ensure all keys exist
          setItems({ ...DEFAULT_ITEMS, ...data.items });
        }
      } catch (e) {
        console.error('Failed to load board state from DB', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadBoard();
  }, []);

  // Save to DB on change
  useEffect(() => {
    if (isFirstRender.current || isLoading) {
      isFirstRender.current = false;
      return;
    }
    
    // Background save to DB
    fetch('/api/db/board', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    }).catch(e => console.error('Failed to sync board', e));

  }, [items, isLoading]);

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

  if (isLoading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading your board...</div>;
  }

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
