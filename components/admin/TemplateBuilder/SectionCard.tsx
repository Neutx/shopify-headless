'use client';

import { GripVertical, Trash2, EyeOff } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import type { Section } from '@/types/sections';
import { getSectionDefinition } from '@/lib/sections/registry';
import * as Icons from 'lucide-react';

interface SectionCardProps {
  section: Section;
  onRemove: (id: string) => void;
  isSelected: boolean;
  onSelect: (id: string) => void;
  // These props were in the old file, keeping interface compatibility or adjusting as needed
  definition?: any;
  onToggleEnabled?: (id: string, enabled: boolean) => void;
}

export default function SectionCard({
  section,
  onRemove,
  isSelected,
  onSelect,
  onToggleEnabled,
}: SectionCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const definition = getSectionDefinition(section.type);
  
  if (!definition) {
    return null;
  }

  // Get icon component
  const IconComponent = (Icons as any)[definition.icon] || Icons.Box;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group border rounded-md bg-card transition-all mb-2 ${
        isSelected ? 'ring-1 ring-primary border-primary' : 'hover:border-primary/50'
      } ${isDragging ? 'shadow-md z-10' : ''}`}
      onClick={() => onSelect(section.id)}
    >
      <div className="flex items-center p-2 gap-2">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-muted-foreground/50 hover:text-foreground p-1"
        >
          <GripVertical className="h-4 w-4" />
        </div>

        {/* Icon */}
        <div className="p-1.5 rounded bg-muted">
          <IconComponent className="h-4 w-4 text-primary" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm truncate leading-none">
              {definition.name}
            </span>
            {!section.enabled && (
              <EyeOff className="h-3 w-3 text-muted-foreground" />
            )}
          </div>
        </div>

        {/* Actions - visible on hover or selected */}
        <div className={`flex items-center gap-1 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
          {onToggleEnabled && (
             <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onToggleEnabled(section.id, !section.enabled);
              }}
              className="h-7 w-7"
              title={section.enabled ? "Hide section" : "Show section"}
            >
              <Icons.Eye className={`h-3.5 w-3.5 ${section.enabled ? 'text-muted-foreground' : 'text-muted-foreground/50'}`} />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(section.id);
            }}
            className="h-7 w-7 text-destructive/70 hover:text-destructive hover:bg-destructive/10"
            title="Remove section"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
