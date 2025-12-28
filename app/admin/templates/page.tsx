'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Trash2, Edit, Copy, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Template } from '@/types/firebase';
import TemplateDuplicateDialog from '@/components/admin/TemplateDuplicateDialog';

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [duplicateDialog, setDuplicateDialog] = useState<{open: boolean; template: Template | null}>({
    open: false,
    template: null,
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/templates');
      const data = await response.json();
      setTemplates(data.templates || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this template?')) {
      return;
    }

    try {
      const response = await fetch(`/api/templates/${templateId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTemplates(templates.filter((t) => t.templateId !== templateId));
      } else {
        alert('Failed to delete template');
      }
    } catch (error) {
      console.error('Error deleting template:', error);
      alert('Error deleting template');
    }
  };

  const handleDuplicate = (template: Template) => {
    setDuplicateDialog({ open: true, template });
  };

  const handleConfirmDuplicate = async (data: any) => {
    try {
      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        await fetchTemplates();
        setDuplicateDialog({ open: false, template: null });
      } else {
        throw new Error('Failed to duplicate template');
      }
    } catch (error) {
      console.error('Error duplicating template:', error);
      throw error;
    }
  };

  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div>Loading templates...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Template Library</h2>
        <p className="text-muted-foreground">
          Create and manage product page templates with customizable sections.
        </p>
      </div>

      <div className="flex justify-between items-center gap-4">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button asChild>
          <Link href="/admin/templates/new">
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Link>
        </Button>
      </div>

      {filteredTemplates.length === 0 ? (
        <div className="border-2 border-dashed rounded-lg p-12 text-center">
          <Layers className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No templates found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery
              ? 'No templates match your search criteria.'
              : 'Get started by creating your first template.'}
          </p>
          {!searchQuery && (
            <Button asChild>
              <Link href="/admin/templates/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Template
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.templateId}
              className="border rounded-lg overflow-hidden bg-card hover:shadow-lg transition-shadow"
            >
              {/* Preview Image */}
              <div className="aspect-video bg-muted relative">
                {template.previewImage ? (
                  <img
                    src={template.previewImage}
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <Layers className="h-12 w-12" />
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                  {template.sections?.length || 0} sections
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-lg truncate">{template.name}</h3>
                  {template.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {template.description}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button asChild variant="default" className="flex-1" size="sm">
                    <Link href={`/admin/templates/${template.templateId}`}>
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDuplicate(template)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(template.templateId)}
                  >
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Duplication Dialog */}
      {duplicateDialog.template && (
        <TemplateDuplicateDialog
          template={duplicateDialog.template}
          open={duplicateDialog.open}
          onClose={() => setDuplicateDialog({ open: false, template: null })}
          onConfirm={handleConfirmDuplicate}
        />
      )}
    </div>
  );
}

