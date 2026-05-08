'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import MovieCard from './MovieCard';

export default function CategoryColumn({ id, title, movies }) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  return (
    <div className="flex flex-col h-full bg-[#111111] border border-[#2c2c2e] rounded-[16px] overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#2c2c2e] bg-[#050505]">
        <h3 className="font-semibold text-white tracking-wide text-sm flex justify-between items-center">
          {title}
          <span className="bg-[#2c2c2e] text-gray-300 text-xs px-2 py-0.5 rounded-full">
            {movies.length}
          </span>
        </h3>
      </div>

      {/* Drop Zone */}
      <div 
        ref={setNodeRef} 
        className={`flex-1 p-3 overflow-y-auto min-h-[150px] transition-colors ${isOver ? 'bg-[#1c1c1e]' : 'bg-transparent'}`}
      >
        <SortableContext 
          id={id}
          items={movies.map(m => m.id)} 
          strategy={verticalListSortingStrategy}
        >
          {movies.map((movie) => (
            <MovieCard key={movie.id} {...movie} />
          ))}
        </SortableContext>
        
        {movies.length === 0 && (
          <div className="h-full flex items-center justify-center text-gray-600 text-xs text-center border-2 border-dashed border-[#2c2c2e] rounded-lg mt-2 py-8">
            Drop movies here
          </div>
        )}
      </div>
    </div>
  );
}
