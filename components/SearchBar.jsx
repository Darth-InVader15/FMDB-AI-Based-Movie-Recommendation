'use client';

import React, { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';

export default function SearchBar({ onAddMovie }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Debounced search effect
  useEffect(() => {
    if (query.trim().length < 3) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      setIsOpen(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error('Search failed');
        const data = await res.json();
        // Limit to exactly 5 suggestions
        setResults((data.results || []).slice(0, 5));
      } catch (err) {
        console.error(err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400); // 400ms debounce

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (movie) => {
    onAddMovie({
      id: movie.id.toString(), // dnd-kit prefers string ids
      title: movie.title || movie.name,
      poster_path: movie.poster_path,
      year: (movie.release_date || movie.first_air_date || '').split('-')[0]
    });
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
          <Search size={20} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a movie or TV series (3+ chars)..."
          className="w-full bg-[#1c1c1e]/80 backdrop-blur-md border border-[#2c2c2e] text-white rounded-2xl py-4 pl-12 pr-4 shadow-2xl focus:outline-none focus:ring-1 focus:ring-white/30 transition-all placeholder-gray-500 text-lg"
        />
        {loading && (
          <div className="absolute inset-y-0 right-4 flex items-center text-gray-400">
            <Loader2 className="animate-spin" size={20} />
          </div>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-[#1c1c1e]/95 backdrop-blur-xl border border-[#2c2c2e] rounded-2xl shadow-2xl overflow-hidden z-[100]">
          <ul className="py-2">
            {results.map((movie) => {
              const title = movie.title || movie.name;
              const year = (movie.release_date || movie.first_air_date || '').split('-')[0];
              return (
                <li 
                  key={movie.id}
                  onClick={() => handleSelect(movie)}
                  className="px-4 py-3 hover:bg-white/10 cursor-pointer flex items-center gap-4 transition-colors border-b border-[#2c2c2e]/50 last:border-0"
                >
                  {movie.poster_path ? (
                    <img 
                      src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} 
                      alt={title} 
                      className="w-12 h-16 object-cover rounded flex-shrink-0 bg-[#333] shadow-md"
                    />
                  ) : (
                    <div className="w-12 h-16 bg-[#2c2c2e] rounded flex-shrink-0 flex items-center justify-center text-xs text-gray-500">
                      No img
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium text-base truncate">{title}</h4>
                    {year && <p className="text-gray-400 text-sm mt-0.5">{year}</p>}
                  </div>
                  <div className="ml-auto text-xs font-semibold text-gray-400 bg-black/40 rounded px-3 py-1.5 hover:text-white transition-colors">
                    Add
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      
      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[-1]" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
