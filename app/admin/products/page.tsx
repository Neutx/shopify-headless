'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { RefreshCw, Settings as SettingsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Template } from '@/types/firebase';
import type { CleanProduct } from '@/types/shopify';

interface ProductWithTemplate extends CleanProduct {
  templateId?: string | null;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductWithTemplate[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [templatesRes, productsRes] = await Promise.all([
        fetch('/api/templates'),
        fetch('/api/products?limit=100'), // New endpoint
      ]);

      const templatesData = await templatesRes.json();
      const productsData = await productsRes.json();
      
      setTemplates(templatesData.templates || []);
      setProducts(productsData.products || []); // Already includes templateId
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const response = await fetch('/api/sync', {
        method: 'POST',
      });

      if (response.ok) {
        alert('Products synced successfully!');
        fetchData();
      } else {
        alert('Failed to sync products');
      }
    } catch (error) {
      console.error('Error syncing:', error);
      alert('Error syncing products');
    } finally {
      setSyncing(false);
    }
  };

  const handleAssignTemplate = async (productHandle: string, templateId: string) => {
    try {
      const product = products.find(p => p.handle === productHandle);
      if (!product) return;

      const response = await fetch(`/api/products/${productHandle}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId,
          shopifyId: product.id,
        }),
      });

      if (response.ok) {
        // Update local state
        setProducts(
          products.map((p) =>
            p.handle === productHandle ? { ...p, templateId } : p
          )
        );
      }
    } catch (error) {
      console.error('Error assigning template:', error);
    }
  };

  const handleBulkAssign = async () => {
    if (selectedProducts.size === 0) {
      alert('Please select products first');
      return;
    }

    const templateId = prompt('Enter template ID to assign:');
    if (!templateId) return;

    try {
      await Promise.all(
        Array.from(selectedProducts).map((productHandle) =>
          handleAssignTemplate(productHandle, templateId)
        )
      );
      alert(`Assigned template to ${selectedProducts.size} products`);
      setSelectedProducts(new Set());
    } catch (error) {
      console.error('Error bulk assigning:', error);
      alert('Error assigning templates');
    }
  };

  const toggleProductSelection = (productHandle: string) => {
    const newSelection = new Set(selectedProducts);
    if (newSelection.has(productHandle)) {
      newSelection.delete(productHandle);
    } else {
      newSelection.add(productHandle);
    }
    setSelectedProducts(newSelection);
  };

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2" />
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Product Management</h2>
        <p className="text-muted-foreground">
          Assign templates to products and customize their sections.
        </p>
      </div>

      <div className="flex justify-between items-center gap-4">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {selectedProducts.size > 0 && (
            <Button onClick={handleBulkAssign} variant="outline">
              Assign Template ({selectedProducts.size})
            </Button>
          )}
          <Button onClick={handleSync} disabled={syncing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
            Sync from Shopify
          </Button>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="border-2 border-dashed rounded-lg p-12 text-center">
          <h3 className="text-lg font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground mb-4">
            Sync products from Shopify to get started.
          </p>
          <Button onClick={handleSync} disabled={syncing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
            Sync from Shopify
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3 w-12">
                  <input
                    type="checkbox"
                    checked={
                      selectedProducts.size === products.length &&
                      products.length > 0
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedProducts(
                          new Set(products.map((p) => p.handle))
                        );
                      } else {
                        setSelectedProducts(new Set());
                      }
                    }}
                  />
                </th>
                <th className="text-left p-3">Product</th>
                <th className="text-left p-3">Template</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((item) => (
                <tr key={item.id} className="border-t hover:bg-muted/50">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedProducts.has(item.handle)}
                      onChange={() => toggleProductSelection(item.handle)}
                    />
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      {item.images?.[0] && (
                        <img
                          src={item.images[0].url}
                          alt={item.title}
                          className="w-10 h-10 object-cover rounded"
                        />
                      )}
                      <div>
                        <div className="font-medium">{item.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.handle}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <Select
                      value={item.templateId || 'none'}
                      onValueChange={(value) =>
                        value !== 'none' &&
                        handleAssignTemplate(item.handle, value)
                      }
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="No template" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No template</SelectItem>
                        {templates.map((template) => (
                          <SelectItem
                            key={template.templateId}
                            value={template.templateId}
                          >
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-3">
                    {item.templateId && (
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                      >
                        <Link href={`/admin/products/${item.handle}/customize` as any}>
                          <SettingsIcon className="h-4 w-4 mr-1" />
                          Customize
                        </Link>
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

