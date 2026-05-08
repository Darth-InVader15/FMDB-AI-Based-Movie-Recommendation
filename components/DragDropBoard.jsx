'use client';

import React, { useState, useEffect } from 'react';
import { 
  DndContext, 
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import { 
  arrayMove, 
  sortableKeyboardCoordinates 
} from '@dnd-kit/sortable';
import CategoryColumn from './CategoryColumn';
import MovieCard from './MovieCard';

// Default categories
const COLUMNS = [
  { id: 'loved', title: 'Loved' },
  { id: 'liked', title: 'Liked' },
  { id: 'ok', title: 'Ok' },
  { id: 'not_for_me', title: 'Not for me' },
];

export default function DragDropBoard({ items, setItems }) {
  const [activeId, setActiveId] = useState(null);

  // Find which container an item is in
  const findContainer = (id) => {
    if (items[id]) return id;
    return Object.keys(items).find((key) => 
      items[key].find((item) => item.id === id)
    );
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return;
    }

    setItems((prev) => {
      const activeItems = prev[activeContainer];
      const overItems = prev[overContainer];

      const activeIndex = activeItems.findIndex((item) => item.id === activeId);
      const overIndex = overItems.findIndex((item) => item.id === overId);

      let newIndex;
      if (overId in prev) {
        newIndex = overItems.length + 1;
      } else {
        const isBelowOverItem =
          over &&
          active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height;

        const modifier = isBelowOverItem ? 1 : 0;
        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      }

      return {
        ...prev,
        [activeContainer]: [
          ...prev[activeContainer].filter((item) => item.id !== active.id),
        ],
        [overContainer]: [
          ...prev[overContainer].slice(0, newIndex),
          activeItems[activeIndex],
          ...prev[overContainer].slice(newIndex, prev[overContainer].length),
        ],
      };
    });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    const activeContainer = findContainer(active.id);

    if (!activeContainer) {
      setActiveId(null);
      return;
    }

    const overId = over?.id;
    if (!overId) {
      // Handle remove by dropping outside (optional, maybe skip for now)
      setActiveId(null);
      return;
    }

    const overContainer = findContainer(overId);

    if (activeContainer && overContainer && activeContainer === overContainer) {
      const activeIndex = items[activeContainer].findIndex((item) => item.id === active.id);
      const overIndex = items[overContainer].findIndex((item) => item.id === overId);

      if (activeIndex !== overIndex) {
        setItems((prev) => ({
          ...prev,
          [overContainer]: arrayMove(prev[overContainer], activeIndex, overIndex),
        }));
      }
    }

    setActiveId(null);
  };

  // Find the active item for the DragOverlay
  const activeItem = activeId 
    ? items[findContainer(activeId)]?.find(item => item.id === activeId)
    : null;

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.4',
        },
      },
    }),
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full h-[60vh] min-h-[400px]">
        {COLUMNS.map((col) => (
          <CategoryColumn 
            key={col.id}
            id={col.id}
            title={col.title}
            movies={items[col.id] || []}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={dropAnimation}>
        {activeItem ? <MovieCard {...activeItem} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
