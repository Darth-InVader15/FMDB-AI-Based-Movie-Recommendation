'use client';

import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

export default function RecommendationSection({ items }) {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState(null);

  const handleGetRecommendations = async () => {
    // Only proceed if we have at least one movie categorized
    const hasMovies = Object.values(items).some(list => list.length > 0);
    if (!hasMovies) {
      setError("Please categorize some movies first!");
      return;
    }

    setLoading(true);
    setError(null);
    setRecommendations([]);

    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });

      if (!res.ok) {
        throw new Error('Failed to get recommendations');
      }

      const data = await res.json();
      setRecommendations(data.recommendations || []);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while fetching recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-16 mb-24 flex flex-col items-center">
      <button
        onClick={handleGetRecommendations}
        disabled={loading}
        className="btn-primary group relative overflow-hidden"
      >
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
        {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
        What to watch next
      </button>

      {error && (
        <p className="text-red-400 mt-4 text-sm bg-red-400/10 px-4 py-2 rounded-lg border border-red-400/20">
          {error}
        </p>
      )}

      {/* Recommendations Grid */}
      {(recommendations.length > 0 || loading) && (
        <div className="w-full mt-12">
          <h2 className="text-2xl font-semibold mb-6 text-white tracking-tight text-center">
            AI Suggestions
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {loading
              ? Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-3">
                    <div className="w-full aspect-[2/3] skeleton" />
                    <div className="h-4 w-3/4 skeleton" />
                    <div className="h-3 w-1/2 skeleton" />
                  </div>
                ))
              : recommendations.map((movie, i) => (
                  <div key={i} className="flex flex-col gap-3 group">
                    <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden bg-[#111] border border-[#222]">
                      {movie.poster_path ? (
                        <img 
                          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                          alt={movie.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                          No Image
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white leading-tight">{movie.title}</h4>
                      {movie.year && (
                        <p className="text-xs text-gray-400 mt-1">{movie.year}</p>
                      )}
                      {movie.reason && (
                        <p className="text-[11px] text-gray-500 mt-2 line-clamp-3 leading-relaxed">
                          {movie.reason}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
          </div>
        </div>
      )}
    </div>
  );
}
