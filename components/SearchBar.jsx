'use client';

import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

export default function SearchBar({ onAddMovie }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setIsOpen(true);
    
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

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
    <div className="relative w-full max-w-2xl mx-auto z-50">
      <form onSubmit={handleSearch} className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
          <Search size={20} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a movie or TV series..."
          className="w-full bg-[#111] border border-[#333] text-white rounded-full py-3 pl-12 pr-4 shadow-sm focus:outline-none focus:ring-1 focus:ring-white/50 transition-all placeholder-gray-500"
        />
        <button 
          type="submit" 
          className="absolute inset-y-1 right-1 bg-white text-black px-4 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : 'Search'}
        </button>
      </form>

      {/* Dropdown Results */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#111] border border-[#333] rounded-[16px] shadow-2xl overflow-hidden max-h-[400px] overflow-y-auto">
          {loading ? (
            <div className="p-8 flex justify-center text-gray-400">
              <Loader2 className="animate-spin" size={24} />
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No results found.
            </div>
          ) : (
            <ul className="py-2">
              {results.map((movie) => {
                const title = movie.title || movie.name;
                const year = (movie.release_date || movie.first_air_date || '').split('-')[0];
                return (
                  <li 
                    key={movie.id}
                    onClick={() => handleSelect(movie)}
                    className="px-4 py-3 hover:bg-[#222] cursor-pointer flex items-center gap-4 transition-colors border-b border-[#222] last:border-0"
                  >
                    {movie.poster_path ? (
                      <img 
                        src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} 
                        alt={title} 
                        className="w-10 h-14 object-cover rounded flex-shrink-0 bg-[#333]"
                      />
                    ) : (
                      <div className="w-10 h-14 bg-[#333] rounded flex-shrink-0 flex items-center justify-center text-xs text-gray-500">
                        No img
                      </div>
                    )}
                    <div>
                      <h4 className="text-white font-medium text-sm">{title}</h4>
                      {year && <p className="text-gray-400 text-xs mt-0.5">{year}</p>}
                    </div>
                    <div className="ml-auto text-xs text-gray-500 border border-gray-600 rounded px-2 py-1">
                      Add
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
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
