'use client';

import { Sparkles } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getStylePresets, getConfigPresets } from '@/lib/sections/presets/registry';
import type { SectionPreset } from '@/types/sections';

interface PresetPickerProps {
  sectionType: string;
  onApplyPreset: (preset: SectionPreset) => void;
}

export default function PresetPicker({ sectionType, onApplyPreset }: PresetPickerProps) {
  const stylePresets = getStylePresets(sectionType);
  const configPresets = getConfigPresets(sectionType);

  if (stylePresets.length === 0 && configPresets.length === 0) {
    return null;
  }

  return (
    <div className="border-t pt-4 mt-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-4 w-4 text-primary" />
        <h4 className="font-medium text-sm">Quick Presets</h4>
      </div>

      <Tabs defaultValue="style" className="w-full">
        {(stylePresets.length > 0 && configPresets.length > 0) && (
          <TabsList className="grid w-full grid-cols-2 mb-3">
            <TabsTrigger value="style">Styles</TabsTrigger>
            <TabsTrigger value="config">Configs</TabsTrigger>
          </TabsList>
        )}

        {stylePresets.length > 0 && (
          <TabsContent value="style" className="space-y-2">
            {stylePresets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => onApplyPreset(preset)}
                className="w-full border rounded-lg p-3 text-left hover:border-primary hover:bg-accent transition-colors"
              >
                <div className="font-medium text-sm">{preset.name}</div>
                {preset.description && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {preset.description}
                  </div>
                )}
              </button>
            ))}
          </TabsContent>
        )}

        {configPresets.length > 0 && (
          <TabsContent value="config" className="space-y-2">
            {configPresets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => onApplyPreset(preset)}
                className="w-full border rounded-lg p-3 text-left hover:border-primary hover:bg-accent transition-colors"
              >
                <div className="font-medium text-sm">{preset.name}</div>
                {preset.description && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {preset.description}
                  </div>
                )}
              </button>
            ))}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

