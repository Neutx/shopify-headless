'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function NewTemplatePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert('Please enter a template name');
      return;
    }

    setCreating(true);
    try {
      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          sections: [],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/admin/templates/${data.template.templateId}`);
      } else {
        alert('Failed to create template');
      }
    } catch (error) {
      console.error('Error creating template:', error);
      alert('Error creating template');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Create New Template</h2>
        <p className="text-muted-foreground">
          Start by giving your template a name and description.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="name">Template Name *</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Modern Product Template"
            className="mt-2"
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what this template is for..."
            className="mt-2 w-full border rounded-md px-3 py-2 min-h-[100px]"
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={creating}>
            {creating ? 'Creating...' : 'Create Template'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

