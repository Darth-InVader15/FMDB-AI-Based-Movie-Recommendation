'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RecommendationSection({ items }) {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState(null);
  const [activeCardId, setActiveCardId] = useState(null);

  const carouselRef = React.useRef(null);

  // Load saved recommendations on mount
  useEffect(() => {
    async function loadSavedRecs() {
      try {
        const res = await fetch('/api/db/recommendations');
        if (res.ok) {
          const data = await res.json();
          if (data.recommendations && data.recommendations.length > 0) {
            setRecommendations(data.recommendations);
          }
        }
      } catch (e) {
        console.error('Failed to load saved recommendations', e);
      }
    }
    loadSavedRecs();
  }, []);

  const handleGetRecommendations = async () => {
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

      if (!res.ok) throw new Error('Failed to get recommendations');

      const data = await res.json();
      setRecommendations(data.recommendations || []);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while fetching recommendations.");
    } finally {
      setLoading(false);
    }
  };

  const scrollCarousel = (dir) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: dir * 300, behavior: 'smooth' });
    }
  };

  const top3 = recommendations.slice(0, 3);
  const rest = recommendations.slice(3);

  return (
    <div className="w-full flex flex-col items-center justify-center h-full py-8">
      
      {recommendations.length === 0 && !loading && (
        <div className="text-center">
          <h2 className="text-5xl font-bold tracking-tight mb-8">Ready for magic?</h2>
          <button
            onClick={handleGetRecommendations}
            className="btn-primary group relative overflow-hidden bg-white text-black hover:bg-gray-200 text-lg px-8 py-4 rounded-full font-bold shadow-2xl transition-all"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            <Sparkles size={24} />
            What to watch next
          </button>
          {error && <p className="text-red-400 mt-6 text-sm">{error}</p>}
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center gap-6">
          <Loader2 className="animate-spin text-white" size={48} />
          <p className="text-gray-400 animate-pulse text-lg tracking-widest uppercase">Analyzing your taste...</p>
        </div>
      )}

      {recommendations.length > 0 && !loading && (
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-6xl mx-auto flex flex-col h-full gap-8"
        >
          {/* Top 3 Contenders */}
          <div>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Sparkles className="text-yellow-400" /> Top Picks for You
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {top3.map((movie, i) => (
                <div key={i} className="glass-panel p-5 flex gap-4 bg-[#1a1a1c] hover:bg-[#222] transition-colors group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/5 to-transparent rounded-bl-full pointer-events-none" />
                  <img 
                    src={movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : 'https://via.placeholder.com/300x450?text=No+Image'} 
                    alt={movie.title}
                    className="w-24 h-36 object-cover rounded shadow-lg shrink-0"
                  />
                  <div className="flex flex-col justify-center">
                    <div className="text-[10px] font-bold tracking-widest text-yellow-500 uppercase mb-1">Rank #{i + 1}</div>
                    <h3 className="text-lg font-bold leading-tight mb-1">{movie.title}</h3>
                    <p className="text-xs text-gray-400 mb-3">{movie.year}</p>
                    <p className="text-sm text-gray-300 leading-snug line-clamp-3 group-hover:line-clamp-none transition-all">{movie.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel for the rest */}
          {rest.length > 0 && (
            <div className="mt-4 relative">
              <h3 className="text-xl font-bold mb-4 text-gray-300">More Suggestions</h3>
              
              <button onClick={() => scrollCarousel(-1)} className="absolute left-0 top-[60%] -translate-y-1/2 -ml-5 z-10 w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                <ChevronLeft size={20} />
              </button>

              <div 
                ref={carouselRef}
                className="flex overflow-x-auto gap-4 pb-8 pt-2 px-2 no-scrollbar snap-x snap-mandatory"
              >
                {rest.map((movie, i) => (
                  <div 
                    key={i + 3} 
                    className="snap-start shrink-0 w-[240px] flex flex-col relative group cursor-pointer"
                    onClick={() => setActiveCardId(activeCardId === i ? null : i)}
                  >
                    <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden shadow-xl mb-3">
                      <img 
                        src={movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : 'https://via.placeholder.com/300x450?text=No+Image'} 
                        alt={movie.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                        <span className="text-white text-sm font-semibold border border-white/30 rounded-full px-3 py-1 w-fit backdrop-blur-md">
                          Click to read why
                        </span>
                      </div>
                    </div>
                    <h4 className="font-semibold text-base truncate">{movie.title}</h4>
                    <p className="text-xs text-gray-400">{movie.year}</p>

                    <AnimatePresence>
                      {activeCardId === i && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2 text-sm text-gray-300 bg-[#222] p-3 rounded-lg"
                        >
                          {movie.reason}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              <button onClick={() => scrollCarousel(1)} className="absolute right-0 top-[60%] -translate-y-1/2 -mr-5 z-10 w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                <ChevronRight size={20} />
              </button>
            </div>
          )}

          <div className="flex justify-center mt-4">
            <button 
              onClick={() => {
                setRecommendations([]);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              className="text-gray-400 hover:text-white transition-colors text-sm border border-gray-600 rounded-full px-6 py-2"
            >
              Start Over
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
