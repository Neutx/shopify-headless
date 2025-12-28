'use client';

import { Plus } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SectionCard from './SectionCard';
import type { Section } from '@/types/sections';
import { Button } from '@/components/ui/button';

interface CanvasAreaProps {
  sections: Section[];
  selectedSectionId: string | null;
  onReorder: (event: DragEndEvent) => void;
  onSelectSection: (sectionId: string) => void;
  onRemoveSection: (sectionId: string) => void;
  onAddSectionPrompt: () => void;
  onToggleSectionEnabled?: (sectionId: string, enabled: boolean) => void;
}

export default function CanvasArea({
  sections,
  selectedSectionId,
  onReorder,
  onSelectSection,
  onRemoveSection,
  onAddSectionPrompt,
  onToggleSectionEnabled,
}: CanvasAreaProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (sections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 px-4 h-full border-2 border-dashed rounded-lg bg-muted/10">
        <div className="text-muted-foreground mb-4">
          <p className="font-medium mb-1">Empty Template</p>
          <p className="text-xs">Add sections to start building</p>
        </div>
        <Button
          onClick={onAddSectionPrompt}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Section
        </Button>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onReorder}
    >
      <SortableContext
        items={sections.map((s) => s.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {sections.map((section) => (
            <SectionCard
              key={section.id}
              section={section}
              onRemove={(id) => onRemoveSection(id)}
              onSelect={(id) => onSelectSection(id)}
              isSelected={section.id === selectedSectionId}
              onToggleEnabled={onToggleSectionEnabled}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
