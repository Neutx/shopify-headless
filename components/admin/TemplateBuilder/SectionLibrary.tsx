'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { getAllSectionDefinitions } from '@/lib/sections/registry';
import * as Icons from 'lucide-react';

interface SectionLibraryProps {
  onAddSection: (type: string) => void;
}

export default function SectionLibrary({ onAddSection }: SectionLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const definitions = getAllSectionDefinitions();

  const filteredDefinitions = definitions.filter((def) =>
    def.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    def.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold mb-2">Section Library</h3>
        <Input
          placeholder="Search sections..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-9"
        />
      </div>

      <div className="space-y-2">
        {filteredDefinitions.map((definition) => {
          const IconComponent = (Icons as any)[definition.icon] || Icons.Box;
          
          return (
            <button
              key={definition.type}
              onClick={() => onAddSection(definition.type)}
              className="w-full border rounded-lg p-3 bg-card hover:bg-accent transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-primary/10">
                  <IconComponent className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{definition.name}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {definition.description}
                  </div>
                </div>
                <Plus className="h-4 w-4 text-muted-foreground" />
              </div>
            </button>
          );
        })}
      </div>

      {filteredDefinitions.length === 0 && (
        <div className="text-center py-8 text-muted-foreground text-sm">
          No sections found
        </div>
      )}
    </div>
  );
}

