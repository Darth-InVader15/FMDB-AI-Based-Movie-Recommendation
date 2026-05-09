'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy, verticalListSortingStrategy } from '@dnd-kit/sortable';
import MovieCard from './MovieCard';

export default function CategoryColumn({ id, title, movies }) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  // Only display up to 8 movies visually so it doesn't clutter
  const displayMovies = movies.slice(0, 8);
  const hiddenCount = movies.length > 8 ? movies.length - 8 : 0;

  return (
    <div className={`flex flex-col h-full glass-panel overflow-hidden transition-colors duration-300 ${isOver ? 'bg-white/5 border-white/30' : 'bg-[#111]'}`}>
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#2c2c2e] bg-black/20 backdrop-blur-sm">
        <h3 className="font-bold text-white tracking-widest text-sm uppercase flex justify-between items-center">
          {title}
          <span className="bg-[#2c2c2e] text-gray-300 text-[10px] font-mono px-2 py-0.5 rounded-full">
            {movies.length}
          </span>
        </h3>
      </div>

      {/* Drop Zone */}
      <div 
        ref={setNodeRef} 
        className="flex-1 p-4 overflow-y-auto min-h-[200px]"
      >
        <div className="flex flex-wrap gap-2 justify-start items-start">
          <SortableContext 
            id={id}
            items={displayMovies.map(m => m.id)} 
            strategy={horizontalListSortingStrategy}
          >
            {displayMovies.map((movie) => (
              <MovieCard key={movie.id} {...movie} />
            ))}
          </SortableContext>
          
          {hiddenCount > 0 && (
            <div className="shrink-0 w-[28%] aspect-[2/3] flex items-center justify-center rounded-md border border-dashed border-[#444] text-xs text-gray-500 font-semibold bg-[#111]">
              +{hiddenCount}
            </div>
          )}

          {movies.length === 0 && (
            <div className="w-full h-32 flex items-center justify-center text-gray-600 text-xs font-medium border-2 border-dashed border-[#2c2c2e] rounded-xl mt-2">
              Drag here
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
