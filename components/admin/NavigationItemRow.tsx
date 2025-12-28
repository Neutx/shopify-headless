'use client';

import { useState } from 'react';
import { GripVertical, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { NavigationItem } from '@/types/navigation';

interface NavigationItemRowProps {
  item: NavigationItem;
  onUpdate: (id: string, updates: Partial<NavigationItem>) => void;
  onRemove: (id: string) => void;
  index: number;
}

export default function NavigationItemRow({
  item,
  onUpdate,
  onRemove,
  index,
}: NavigationItemRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const hasChildren = item.type === 'dropdown' && item.children && item.children.length > 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-start gap-2 p-2 rounded-md border transition-colors ${
        index % 2 === 0 ? 'bg-card' : 'bg-muted/30'
      } ${isDragging ? 'shadow-lg' : 'hover:bg-muted/50'}`}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="mt-2 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
      >
        <GripVertical className="h-5 w-5" />
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-2">
        {/* First Row: Label, Type, Delete */}
        <div className="flex items-center gap-2">
          <div className="flex-1 min-w-0">
            <Input
              value={item.label}
              onChange={(e) => onUpdate(item.id, { label: e.target.value })}
              placeholder="Menu Label"
              className="h-9"
            />
          </div>
          <div className="w-32">
            <Select
              value={item.type}
              onValueChange={(value: any) => onUpdate(item.id, { type: value })}
            >
              <SelectTrigger className="h-9">
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
          <Button
            variant="destructive"
            size="icon"
            onClick={() => onRemove(item.id)}
            className="h-9 w-9"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Second Row: Type-specific inputs */}
        {item.type === 'url' && (
          <div>
            <Input
              value={item.link || ''}
              onChange={(e) => onUpdate(item.id, { link: e.target.value })}
              placeholder="https://example.com"
              className="h-9"
            />
          </div>
        )}

        {item.type === 'collection' && (
          <div>
            <Input
              value={item.collectionHandle || ''}
              onChange={(e) =>
                onUpdate(item.id, { collectionHandle: e.target.value })
              }
              placeholder="collection-handle"
              className="h-9"
            />
          </div>
        )}

        {item.type === 'product' && (
          <div>
            <Input
              value={item.productHandle || ''}
              onChange={(e) =>
                onUpdate(item.id, { productHandle: e.target.value })
              }
              placeholder="product-handle"
              className="h-9"
            />
          </div>
        )}

        {/* Dropdown children */}
        {item.type === 'dropdown' && (
          <div className="space-y-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 text-xs"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 mr-1" />
              ) : (
                <ChevronRight className="h-4 w-4 mr-1" />
              )}
              {hasChildren
                ? `${item.children?.length} child${item.children?.length !== 1 ? 'ren' : ''}`
                : 'No children'}
            </Button>
            {isExpanded && (
              <div className="ml-4 space-y-2 border-l-2 pl-4">
                {item.children?.map((child) => (
                  <div
                    key={child.id}
                    className="flex items-center gap-2 p-2 rounded bg-muted/50"
                  >
                    <div className="flex-1 min-w-0">
                      <Input
                        value={child.label}
                        onChange={(e) => {
                          const updatedChildren = item.children?.map((c) =>
                            c.id === child.id ? { ...c, label: e.target.value } : c
                          );
                          onUpdate(item.id, { children: updatedChildren });
                        }}
                        placeholder="Child Label"
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="w-28">
                      <Select
                        value={child.type}
                        onValueChange={(value: any) => {
                          const updatedChildren = item.children?.map((c) =>
                            c.id === child.id ? { ...c, type: value } : c
                          );
                          onUpdate(item.id, { children: updatedChildren });
                        }}
                      >
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="url">URL</SelectItem>
                          <SelectItem value="collection">Collection</SelectItem>
                          <SelectItem value="product">Product</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {child.type === 'url' && (
                      <div className="flex-1">
                        <Input
                          value={child.link || ''}
                          onChange={(e) => {
                            const updatedChildren = item.children?.map((c) =>
                              c.id === child.id ? { ...c, link: e.target.value } : c
                            );
                            onUpdate(item.id, { children: updatedChildren });
                          }}
                          placeholder="URL"
                          className="h-8 text-sm"
                        />
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const updatedChildren = item.children?.filter(
                          (c) => c.id !== child.id
                        );
                        onUpdate(item.id, { children: updatedChildren });
                      }}
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newChild: NavigationItem = {
                      id: `child-${Date.now()}`,
                      label: 'New Child',
                      type: 'url',
                      link: '#',
                      order: item.children?.length || 0,
                      enabled: true,
                    };
                    onUpdate(item.id, {
                      children: [...(item.children || []), newChild],
                    });
                  }}
                  className="h-8 text-xs ml-4"
                >
                  Add Child
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

