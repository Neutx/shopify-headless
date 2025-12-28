'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Section, SectionDefinition, SectionSettingSchema, SectionPreset } from '@/types/sections';
import PresetPicker from './PresetPicker';
import { applyPreset } from '@/lib/sections/presets/registry';

interface SettingsPanelProps {
  section: Section;
  definition: SectionDefinition;
  onUpdate: (updates: Partial<Section>) => void;
}

export default function SettingsPanel({
  section,
  definition,
  onUpdate,
}: SettingsPanelProps) {
  const handleSettingChange = (key: string, value: any) => {
    onUpdate({
      settings: {
        ...section.settings,
        [key]: value,
      },
    });
  };

  const renderSettingInput = (schema: SectionSettingSchema) => {
    const value = section.settings[schema.key] ?? schema.default;

    switch (schema.type) {
      case 'text':
        return (
          <Input
            id={schema.key}
            value={value}
            onChange={(e) => handleSettingChange(schema.key, e.target.value)}
            placeholder={schema.placeholder}
          />
        );

      case 'textarea':
        return (
          <textarea
            id={schema.key}
            value={value}
            onChange={(e) => handleSettingChange(schema.key, e.target.value)}
            placeholder={schema.placeholder}
            className="w-full border rounded-md px-3 py-2 min-h-[80px]"
          />
        );

      case 'number':
      case 'range':
        return (
          <Input
            id={schema.key}
            type="number"
            value={value}
            onChange={(e) => handleSettingChange(schema.key, Number(e.target.value))}
            min={schema.min}
            max={schema.max}
            step={schema.step}
          />
        );

      case 'toggle':
        return (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => handleSettingChange(schema.key, e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm">{value ? 'Enabled' : 'Disabled'}</span>
          </label>
        );

      case 'color':
        return (
          <div className="flex gap-2">
            <Input
              id={schema.key}
              type="color"
              value={value === 'transparent' ? '#ffffff' : value}
              onChange={(e) => handleSettingChange(schema.key, e.target.value)}
              className="w-20"
            />
            <Input
              value={value}
              onChange={(e) => handleSettingChange(schema.key, e.target.value)}
              placeholder="#ffffff"
              className="flex-1"
            />
          </div>
        );

      case 'select':
        return (
          <Select
            value={value}
            onValueChange={(newValue) => handleSettingChange(schema.key, newValue)}
          >
            <SelectTrigger id={schema.key}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {schema.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-lg mb-1">{definition.name}</h3>
        <p className="text-sm text-muted-foreground">{definition.description}</p>
      </div>

      {/* Enabled Toggle */}
      <div className="space-y-2 pb-4 border-b">
        <Label htmlFor="enabled">Visibility</Label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            id="enabled"
            checked={section.enabled}
            onChange={(e) => onUpdate({ enabled: e.target.checked })}
            className="w-4 h-4"
          />
          <span className="text-sm">
            {section.enabled ? 'Visible on frontend' : 'Hidden on frontend'}
          </span>
        </label>
      </div>

      {/* Settings */}
      <div className="space-y-4">
        <h4 className="font-medium">Settings</h4>
        {definition.settingsSchema.map((schema) => (
          <div key={schema.key} className="space-y-2">
            <Label htmlFor={schema.key}>
              {schema.label}
              {schema.description && (
                <span className="block text-xs text-muted-foreground font-normal mt-0.5">
                  {schema.description}
                </span>
              )}
            </Label>
            {renderSettingInput(schema)}
          </div>
        ))}
      </div>

      {/* Reset to Defaults */}
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          onUpdate({
            settings: { ...definition.defaultSettings },
          })
        }
        className="w-full"
      >
        Reset to Defaults
      </Button>

      {/* Preset Picker */}
      <PresetPicker
        sectionType={section.type}
        onApplyPreset={(preset: SectionPreset) => {
          const updated = applyPreset(section, preset);
          onUpdate({ settings: updated.settings });
        }}
      />
    </div>
  );
}

