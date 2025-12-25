'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { NavigationItem, HeaderNavigation, FooterNavigation } from '@/types/navigation';

export default function NavigationPage() {
  const [headerNav, setHeaderNav] = useState<HeaderNavigation | null>(null);
  const [footerNav, setFooterNav] = useState<FooterNavigation | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchNavigation();
  }, []);

  const fetchNavigation = async () => {
    try {
      const [headerRes, footerRes] = await Promise.all([
        fetch('/api/navigation/header'),
        fetch('/api/navigation/footer'),
      ]);

      const headerData = await headerRes.json();
      const footerData = await footerRes.json();

      setHeaderNav(headerData.navigation);
      setFooterNav(footerData.navigation);
    } catch (error) {
      console.error('Error fetching navigation:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveHeaderNavigation = async () => {
    if (!headerNav) return;

    setSaving(true);
    try {
      const response = await fetch('/api/navigation/header', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: headerNav.items }),
      });

      if (response.ok) {
        alert('Header navigation saved successfully!');
      }
    } catch (error) {
      console.error('Error saving header navigation:', error);
      alert('Failed to save navigation');
    } finally {
      setSaving(false);
    }
  };

  const saveFooterNavigation = async () => {
    if (!footerNav) return;

    setSaving(true);
    try {
      const response = await fetch('/api/navigation/footer', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(footerNav),
      });

      if (response.ok) {
        alert('Footer navigation saved successfully!');
      }
    } catch (error) {
      console.error('Error saving footer navigation:', error);
      alert('Failed to save navigation');
    } finally {
      setSaving(false);
    }
  };

  const addHeaderItem = () => {
    if (!headerNav) return;

    const newItem: NavigationItem = {
      id: `nav-${Date.now()}`,
      label: 'New Item',
      type: 'url',
      link: '#',
      order: headerNav.items.length,
      enabled: true,
    };

    setHeaderNav({
      ...headerNav,
      items: [...headerNav.items, newItem],
    });
  };

  const removeHeaderItem = (id: string) => {
    if (!headerNav) return;

    setHeaderNav({
      ...headerNav,
      items: headerNav.items.filter((item) => item.id !== id),
    });
  };

  const updateHeaderItem = (id: string, updates: Partial<NavigationItem>) => {
    if (!headerNav) return;

    setHeaderNav({
      ...headerNav,
      items: headerNav.items.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Navigation Management</h2>
        <p className="text-muted-foreground">
          Manage your site's header and footer navigation menus.
        </p>
      </div>

      <Tabs defaultValue="header" className="w-full">
        <TabsList>
          <TabsTrigger value="header">Header Navigation</TabsTrigger>
          <TabsTrigger value="footer">Footer Navigation</TabsTrigger>
        </TabsList>

        {/* Header Navigation */}
        <TabsContent value="header" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Header Menu Items</h3>
            <Button onClick={addHeaderItem}>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>

          <div className="space-y-4">
            {headerNav?.items.map((item) => (
              <div
                key={item.id}
                className="border rounded-lg p-4 space-y-4 bg-card"
              >
                <div className="flex items-center gap-2">
                  <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`label-${item.id}`}>Label</Label>
                      <Input
                        id={`label-${item.id}`}
                        value={item.label}
                        onChange={(e) =>
                          updateHeaderItem(item.id, { label: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor={`type-${item.id}`}>Type</Label>
                      <Select
                        value={item.type}
                        onValueChange={(value: any) =>
                          updateHeaderItem(item.id, { type: value })
                        }
                      >
                        <SelectTrigger id={`type-${item.id}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="url">URL</SelectItem>
                          <SelectItem value="collection">Collection</SelectItem>
                          <SelectItem value="product">Product</SelectItem>
                          <SelectItem value="dropdown">Dropdown</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeHeaderItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {item.type === 'url' && (
                  <div>
                    <Label htmlFor={`link-${item.id}`}>URL</Label>
                    <Input
                      id={`link-${item.id}`}
                      value={item.link || ''}
                      onChange={(e) =>
                        updateHeaderItem(item.id, { link: e.target.value })
                      }
                      placeholder="https://example.com"
                    />
                  </div>
                )}

                {item.type === 'collection' && (
                  <div>
                    <Label htmlFor={`collection-${item.id}`}>Collection Handle</Label>
                    <Input
                      id={`collection-${item.id}`}
                      value={item.collectionHandle || ''}
                      onChange={(e) =>
                        updateHeaderItem(item.id, {
                          collectionHandle: e.target.value,
                        })
                      }
                      placeholder="collection-handle"
                    />
                  </div>
                )}

                {item.type === 'product' && (
                  <div>
                    <Label htmlFor={`product-${item.id}`}>Product Handle</Label>
                    <Input
                      id={`product-${item.id}`}
                      value={item.productHandle || ''}
                      onChange={(e) =>
                        updateHeaderItem(item.id, {
                          productHandle: e.target.value,
                        })
                      }
                      placeholder="product-handle"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <Button onClick={saveHeaderNavigation} disabled={saving}>
            {saving ? 'Saving...' : 'Save Header Navigation'}
          </Button>
        </TabsContent>

        {/* Footer Navigation */}
        <TabsContent value="footer" className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Footer Settings</h3>
            <p className="text-sm text-muted-foreground">
              Footer navigation management coming soon. You can add sections, social
              links, and newsletter settings.
            </p>
          </div>

          <Button onClick={saveFooterNavigation} disabled={saving}>
            {saving ? 'Saving...' : 'Save Footer Navigation'}
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}

