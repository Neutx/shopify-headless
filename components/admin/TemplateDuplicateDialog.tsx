'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Template, CreateTemplateInput } from '@/types/firebase';
import type { Section } from '@/types/sections';
import { getSectionDefinition } from '@/lib/sections/registry';

interface TemplateDuplicateDialogProps {
  template: Template;
  open: boolean;
  onClose: () => void;
  onConfirm: (data: CreateTemplateInput) => Promise<void>;
}

export default function TemplateDuplicateDialog({
  template,
  open,
  onClose,
  onConfirm,
}: TemplateDuplicateDialogProps) {
  const [name, setName] = useState(`${template.name} (Copy)`);
  const [description, setDescription] = useState(template.description || '');
  const [sections, setSections] = useState<Section[]>(template.sections || []);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert('Please enter a template name');
      return;
    }

    setSubmitting(true);
    try {
      await onConfirm({
        name: name.trim(),
        description: description.trim(),
        sections,
      });
      onClose();
    } catch (error) {
      console.error('Error duplicating template:', error);
      alert('Failed to duplicate template');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleSection = (index: number) => {
    const updated = [...sections];
    updated[index] = { ...updated[index], enabled: !updated[index].enabled };
    setSections(updated);
  };

  const removeSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Duplicate Template</DialogTitle>
          <DialogDescription>
            Customize the duplicated template before creating
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Template Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter template name"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter template description"
              className="mt-2 w-full border rounded-md px-3 py-2 min-h-[80px]"
            />
          </div>

          <div>
            <Label>Sections ({sections.length})</Label>
            <div className="mt-2 border rounded-lg p-3 max-h-64 overflow-y-auto space-y-2">
              {sections.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No sections in template
                </p>
              ) : (
                sections.map((section, index) => {
                  const definition = getSectionDefinition(section.type);
                  return (
                    <div
                      key={section.id}
                      className="flex items-center justify-between p-2 bg-muted rounded"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <input
                          type="checkbox"
                          checked={section.enabled}
                          onChange={() => toggleSection(index)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">
                          {definition?.name || section.type}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSection(index)}
                        className="h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Creating...' : 'Create Duplicate'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

