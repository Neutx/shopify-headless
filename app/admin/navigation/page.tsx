'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import NavigationItemRow from '@/components/admin/NavigationItemRow';
import type {
  NavigationItem,
  HeaderNavigation,
  FooterNavigation,
  FooterSection,
  SocialLink,
} from '@/types/navigation';

export default function NavigationPage() {
  const [headerNav, setHeaderNav] = useState<HeaderNavigation | null>(null);
  const [footerNav, setFooterNav] = useState<FooterNavigation | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
      // Update order based on array index
      const itemsWithOrder = headerNav.items.map((item, index) => ({
        ...item,
        order: index,
      }));

      const response = await fetch('/api/navigation/header', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: itemsWithOrder }),
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

  const handleHeaderDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id && headerNav) {
      setHeaderNav({
        ...headerNav,
        items: arrayMove(
          headerNav.items,
          headerNav.items.findIndex((item) => item.id === active.id),
          headerNav.items.findIndex((item) => item.id === over.id)
        ),
      });
    }
  };

  // Footer functions
  const addFooterSection = () => {
    if (!footerNav) return;

    const newSection: FooterSection = {
      title: 'New Section',
      items: [],
      order: footerNav.sections.length,
    };

    setFooterNav({
      ...footerNav,
      sections: [...footerNav.sections, newSection],
    });
  };

  const removeFooterSection = (index: number) => {
    if (!footerNav) return;

    setFooterNav({
      ...footerNav,
      sections: footerNav.sections.filter((_, i) => i !== index),
    });
  };

  const updateFooterSection = (index: number, updates: Partial<FooterSection>) => {
    if (!footerNav) return;

    setFooterNav({
      ...footerNav,
      sections: footerNav.sections.map((section, i) =>
        i === index ? { ...section, ...updates } : section
      ),
    });
  };

  const addFooterLink = (sectionIndex: number) => {
    if (!footerNav) return;

    const newLink: NavigationItem = {
      id: `footer-link-${Date.now()}`,
      label: 'New Link',
      type: 'url',
      link: '#',
      order: footerNav.sections[sectionIndex].items.length,
      enabled: true,
    };

    updateFooterSection(sectionIndex, {
      items: [...footerNav.sections[sectionIndex].items, newLink],
    });
  };

  const removeFooterLink = (sectionIndex: number, linkId: string) => {
    if (!footerNav) return;

    updateFooterSection(sectionIndex, {
      items: footerNav.sections[sectionIndex].items.filter(
        (item) => item.id !== linkId
      ),
    });
  };

  const updateFooterLink = (
    sectionIndex: number,
    linkId: string,
    updates: Partial<NavigationItem>
  ) => {
    if (!footerNav) return;

    updateFooterSection(sectionIndex, {
      items: footerNav.sections[sectionIndex].items.map((item) =>
        item.id === linkId ? { ...item, ...updates } : item
      ),
    });
  };

  const handleFooterSectionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id && footerNav) {
      const oldIndex = footerNav.sections.findIndex(
        (section) => section.title === active.id
      );
      const newIndex = footerNav.sections.findIndex(
        (section) => section.title === over.id
      );

      setFooterNav({
        ...footerNav,
        sections: arrayMove(footerNav.sections, oldIndex, newIndex),
      });
    }
  };

  const handleFooterLinkDragEnd = (
    event: DragEndEvent,
    sectionIndex: number
  ) => {
    const { active, over } = event;

    if (over && active.id !== over.id && footerNav) {
      const section = footerNav.sections[sectionIndex];
      const oldIndex = section.items.findIndex((item) => item.id === active.id);
      const newIndex = section.items.findIndex((item) => item.id === over.id);

      updateFooterSection(sectionIndex, {
        items: arrayMove(section.items, oldIndex, newIndex),
      });
    }
  };

  const addSocialLink = () => {
    if (!footerNav) return;

    const newSocialLink: SocialLink = {
      platform: 'facebook',
      url: '',
      order: footerNav.socialLinks.length,
    };

    setFooterNav({
      ...footerNav,
      socialLinks: [...footerNav.socialLinks, newSocialLink],
    });
  };

  const removeSocialLink = (index: number) => {
    if (!footerNav) return;

    setFooterNav({
      ...footerNav,
      socialLinks: footerNav.socialLinks.filter((_, i) => i !== index),
    });
  };

  const updateSocialLink = (index: number, updates: Partial<SocialLink>) => {
    if (!footerNav) return;

    setFooterNav({
      ...footerNav,
      socialLinks: footerNav.socialLinks.map((link, i) =>
        i === index ? { ...link, ...updates } : link
      ),
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  // Ensure headerNav has items array
  if (!headerNav) {
    setHeaderNav({ items: [] });
  }

  // Ensure footerNav has sections and socialLinks
  if (!footerNav) {
    setFooterNav({
      sections: [],
      socialLinks: [],
      newsletter: {
        enabled: false,
        placeholder: 'Enter your email',
      },
    });
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
        <TabsContent value="header" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Header Menu Items</h3>
            <Button onClick={addHeaderItem}>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>

          <div className="border rounded-lg p-2 space-y-1">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleHeaderDragEnd}
            >
              <SortableContext
                items={headerNav?.items.map((item) => item.id) || []}
                strategy={verticalListSortingStrategy}
              >
                {headerNav?.items.map((item, index) => (
                  <NavigationItemRow
                    key={item.id}
                    item={item}
                    onUpdate={updateHeaderItem}
                    onRemove={removeHeaderItem}
                    index={index}
                  />
                ))}
              </SortableContext>
            </DndContext>
            {(!headerNav?.items || headerNav.items.length === 0) && (
              <div className="text-center py-8 text-muted-foreground">
                No menu items yet. Click "Add Item" to get started.
              </div>
            )}
          </div>

          <Button onClick={saveHeaderNavigation} disabled={saving}>
            {saving ? 'Saving...' : 'Save Header Navigation'}
          </Button>
        </TabsContent>

        {/* Footer Navigation */}
        <TabsContent value="footer" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Footer Sections</h3>
            <Button onClick={addFooterSection}>
              <Plus className="h-4 w-4 mr-2" />
              Add Section
            </Button>
          </div>

          <div className="space-y-4">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleFooterSectionDragEnd}
            >
              <SortableContext
                items={footerNav?.sections.map((s) => s.title) || []}
                strategy={verticalListSortingStrategy}
              >
                {footerNav?.sections.map((section, sectionIndex) => (
                  <FooterSectionRow
                    key={section.title}
                    section={section}
                    sectionIndex={sectionIndex}
                    onUpdate={updateFooterSection}
                    onRemove={removeFooterSection}
                    onAddLink={addFooterLink}
                    onRemoveLink={removeFooterLink}
                    onUpdateLink={updateFooterLink}
                    onLinkDragEnd={handleFooterLinkDragEnd}
                    footerNav={footerNav}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Social Media Links</h3>
              <Button onClick={addSocialLink}>
                <Plus className="h-4 w-4 mr-2" />
                Add Social Link
              </Button>
            </div>

            <div className="border rounded-lg p-2 space-y-2">
              {footerNav?.socialLinks.map((link, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 rounded-md bg-card"
                >
                  <div className="w-32">
                    <Select
                      value={link.platform}
                      onValueChange={(value) =>
                        updateSocialLink(index, { platform: value })
                      }
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="twitter">Twitter</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="youtube">YouTube</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="pinterest">Pinterest</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <Input
                      value={link.url}
                      onChange={(e) =>
                        updateSocialLink(index, { url: e.target.value })
                      }
                      placeholder="https://..."
                      className="h-9"
                    />
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeSocialLink(index)}
                    className="h-9 w-9"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Button onClick={saveFooterNavigation} disabled={saving}>
            {saving ? 'Saving...' : 'Save Footer Navigation'}
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Footer Section Component
interface FooterSectionRowProps {
  section: FooterSection;
  sectionIndex: number;
  onUpdate: (index: number, updates: Partial<FooterSection>) => void;
  onRemove: (index: number) => void;
  onAddLink: (sectionIndex: number) => void;
  onRemoveLink: (sectionIndex: number, linkId: string) => void;
  onUpdateLink: (
    sectionIndex: number,
    linkId: string,
    updates: Partial<NavigationItem>
  ) => void;
  onLinkDragEnd: (event: DragEndEvent, sectionIndex: number) => void;
  footerNav: FooterNavigation;
}

function FooterSectionRow({
  section,
  sectionIndex,
  onUpdate,
  onRemove,
  onAddLink,
  onRemoveLink,
  onUpdateLink,
  onLinkDragEnd,
  footerNav: _footerNav,
}: FooterSectionRowProps) {
  const linkSensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.title });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border rounded-lg p-4 bg-card"
    >
      <div className="flex items-center gap-2 mb-3">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
        >
          <GripVertical className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <Input
            value={section.title}
            onChange={(e) => onUpdate(sectionIndex, { title: e.target.value })}
            placeholder="Section Title"
            className="h-9 font-semibold"
          />
        </div>
        <Button
          variant="destructive"
          size="icon"
          onClick={() => onRemove(sectionIndex)}
          className="h-9 w-9"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="ml-7 space-y-2">
        <DndContext
          sensors={linkSensors}
          collisionDetection={closestCenter}
          onDragEnd={(e) => onLinkDragEnd(e, sectionIndex)}
        >
          <SortableContext
            items={section.items.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            {section.items.map((item, itemIndex) => (
              <NavigationItemRow
                key={item.id}
                item={item}
                onUpdate={(id, updates) => onUpdateLink(sectionIndex, id, updates)}
                onRemove={(id) => onRemoveLink(sectionIndex, id)}
                index={itemIndex}
              />
            ))}
          </SortableContext>
        </DndContext>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAddLink(sectionIndex)}
          className="h-8"
        >
          <Plus className="h-3 w-3 mr-1" />
          Add Link
        </Button>
      </div>
    </div>
  );
}
