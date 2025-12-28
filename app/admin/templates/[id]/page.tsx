'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { arrayMove } from '@dnd-kit/sortable';
import type { DragEndEvent } from '@dnd-kit/core';
import type { Template } from '@/types/firebase';
import type { Section } from '@/types/sections';
import { getSectionDefinition } from '@/lib/sections/registry';
import { createSectionFromDefinition } from '@/lib/sections/utils';
import SectionLibrary from '@/components/admin/TemplateBuilder/SectionLibrary';
import CanvasArea from '@/components/admin/TemplateBuilder/CanvasArea';
import SettingsPanel from '@/components/admin/TemplateBuilder/SettingsPanel';
import PreviewFrame from '@/components/admin/TemplateBuilder/PreviewFrame';

interface TemplateBuilderPageProps {
  params: Promise<{ id: string }>;
}

export default function TemplateBuilderPage({ params }: TemplateBuilderPageProps) {
  const router = useRouter();
  const [templateId, setTemplateId] = useState<string>('');
  const [template, setTemplate] = useState<Template | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    params.then((p) => {
      setTemplateId(p.id);
      fetchTemplate(p.id);
    });
  }, [params]);

  // Listen for messages from preview iframe (e.g. double click to open settings)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'OPEN_SETTINGS' && event.data.sectionId) {
        setSelectedSectionId(event.data.sectionId);
        setIsSettingsOpen(true);
      }
      if (event.data.type === 'SELECT_SECTION' && event.data.sectionId) {
        setSelectedSectionId(event.data.sectionId);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Open settings when a section is selected via other means (e.g. canvas click)
  // Optional: automatically open settings on selection? 
  // For now, let's keep it manual or double-click driven to avoid annoyance
  
  const fetchTemplate = async (id: string) => {
    try {
      const response = await fetch(`/api/templates/${id}`);
      if (response.ok) {
        const data = await response.json();
        setTemplate(data.template);
        setSections(data.template.sections || []);
      }
    } catch (error) {
      console.error('Error fetching template:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSection = (type: string) => {
    const newSection = createSectionFromDefinition(type, sections.length);
    if (newSection) {
      setSections([...sections, newSection]);
      setSelectedSectionId(newSection.id);
      setIsLibraryOpen(false); // Close library after adding
    }
  };

  const handleRemoveSection = (sectionId: string) => {
    setSections(sections.filter((s) => s.id !== sectionId));
    if (selectedSectionId === sectionId) {
      setSelectedSectionId(null);
      setIsSettingsOpen(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);

      const reordered = arrayMove(sections, oldIndex, newIndex);
      // Update order property
      setSections(reordered.map((section, index) => ({ ...section, order: index })));
    }
  };

  const handleUpdateSection = (sectionId: string, updates: Partial<Section>) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId ? { ...section, ...updates } : section
      )
    );
  };

  const handleSave = async () => {
    if (!template) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/templates/${templateId}/sections`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections }),
      });

      if (response.ok) {
        // Optional: show toast
      } else {
        alert('Failed to save template');
      }
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Error saving template');
    } finally {
      setSaving(false);
    }
  };

  const selectedSection = sections.find((s) => s.id === selectedSectionId);
  const selectedDefinition = selectedSection
    ? getSectionDefinition(selectedSection.type)
    : null;

  if (loading) {
    return <div className="p-8 text-center">Loading template...</div>;
  }

  if (!template) {
    return <div className="p-8 text-center">Template not found</div>;
  }

  return (
    <div className="h-full flex flex-col m-0">
      {/* Main Content Area - 2 Columns */}
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas / Section List - Left Column (30%) */}
        <div className="w-[350px] border-r bg-muted/10 flex flex-col shrink-0">
           <div className="p-3 border-b bg-muted/20 flex justify-between items-center gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8 shrink-0">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex-1 min-w-0">
                <h2 className="font-medium text-sm truncate">{template.name}</h2>
                <span className="text-xs text-muted-foreground">{sections.length} sections</span>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button onClick={handleSave} disabled={saving} size="sm">
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </div>
           </div>
           
           <div className="flex-1 overflow-y-auto p-3">
             <CanvasArea
                sections={sections}
                selectedSectionId={selectedSectionId}
                onReorder={handleDragEnd}
                onSelectSection={(id) => {
                  setSelectedSectionId(id);
                  // Optional: Open settings on click?
                  // setIsSettingsOpen(true); 
                }}
                onRemoveSection={handleRemoveSection}
                onAddSectionPrompt={() => setIsLibraryOpen(true)}
              />
              
              <Dialog open={isLibraryOpen} onOpenChange={setIsLibraryOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4 border-dashed"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Section
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add Section</DialogTitle>
                  </DialogHeader>
                  <div className="pt-4">
                    <SectionLibrary onAddSection={handleAddSection} />
                  </div>
                </DialogContent>
              </Dialog>
           </div>
        </div>

        {/* Live Preview - Right Column (70%) */}
        <div className="flex-1 bg-muted/30 p-4 overflow-hidden flex flex-col">
          <PreviewFrame
            sections={sections}
            selectedSectionId={selectedSectionId}
          />
        </div>
      </div>

      {/* Settings Sheet (Right Drawer) */}
      <Sheet open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              Edit {selectedDefinition?.name || 'Section'}
            </SheetTitle>
          </SheetHeader>
          
          <div className="mt-6">
            {selectedSection && selectedDefinition ? (
              <SettingsPanel
                section={selectedSection}
                definition={selectedDefinition}
                onUpdate={(updates) => handleUpdateSection(selectedSection.id, updates)}
              />
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>Select a section to configure its settings</p>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
