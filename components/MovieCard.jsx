'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function MovieCard({ id, title, poster_path }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 1,
  };

  const imageUrl = poster_path 
    ? `https://image.tmdb.org/t/p/w200${poster_path}`
    : 'https://via.placeholder.com/200x300?text=No+Image';

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group cursor-grab active:cursor-grabbing shrink-0 w-[28%] aspect-[2/3] transition-all duration-200 hover:-translate-y-2 hover:scale-105 ${isDragging ? 'opacity-70 scale-105 z-50 shadow-2xl ring-2 ring-white/50' : 'shadow-lg'}`}
      {...attributes}
      {...listeners}
      title={title}
    >
      <img 
        src={imageUrl} 
        alt={title} 
        className="w-full h-full object-cover rounded-md bg-[#222] border border-[#333]"
        draggable={false}
      />
      {/* Tooltip on hover */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
        {title}
      </div>
    </div>
  );
}
