'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

export default function MovieCard({ id, title, poster_path, year }) {
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
    opacity: isDragging ? 0.8 : 1,
  };

  const imageUrl = poster_path 
    ? `https://image.tmdb.org/t/p/w200${poster_path}`
    : 'https://via.placeholder.com/200x300?text=No+Image';

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`glass-panel p-2 mb-3 flex gap-3 items-center group relative ${isDragging ? 'shadow-lg ring-1 ring-white/20' : ''}`}
      {...attributes}
      {...listeners}
    >
      {/* Drag Handle */}
      <div className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-white transition-colors p-1 -ml-1">
        <GripVertical size={16} />
      </div>

      {/* Poster */}
      <img 
        src={imageUrl} 
        alt={title} 
        className="w-12 h-18 object-cover rounded-sm flex-shrink-0 bg-[#222]"
        loading="lazy"
      />

      {/* Info */}
      <div className="flex-1 min-w-0 pr-2">
        <h4 className="font-semibold text-sm text-white truncate" title={title}>
          {title}
        </h4>
        {year && (
          <p className="text-xs text-gray-400 mt-0.5">
            {year}
          </p>
        )}
      </div>
    </div>
  );
}
