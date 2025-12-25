'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Upload, X, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { SiteSettings } from '@/types/site-settings';

export default function SiteSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [logoType, setLogoType] = useState<'file' | 'cdn'>('file');
  const [cdnUrl, setCdnUrl] = useState('');
  const [logoAltText, setLogoAltText] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/site-settings');
      const data = await response.json();
      setSettings(data.settings);
      
      if (data.settings?.logo) {
        setLogoType(data.settings.logo.type);
        setLogoAltText(data.settings.logo.altText || '');
        if (data.settings.logo.type === 'cdn') {
          setCdnUrl(data.settings.logo.cdnUrl || '');
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('altText', logoAltText);

      const response = await fetch('/api/logo/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Logo uploaded successfully!');
        fetchSettings();
      } else {
        const error = await response.json();
        alert(error.error?.message || 'Failed to upload logo');
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
      alert('Failed to upload logo');
    } finally {
      setUploading(false);
    }
  };

  const saveCdnLogo = async () => {
    if (!cdnUrl) {
      alert('Please enter a CDN URL');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/logo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cdnUrl, altText: logoAltText }),
      });

      if (response.ok) {
        alert('Logo updated successfully!');
        fetchSettings();
      } else {
        alert('Failed to update logo');
      }
    } catch (error) {
      console.error('Error updating logo:', error);
      alert('Failed to update logo');
    } finally {
      setSaving(false);
    }
  };

  const removeLogo = async () => {
    if (!confirm('Are you sure you want to remove the logo?')) return;

    try {
      const response = await fetch('/api/logo', {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Logo removed successfully!');
        fetchSettings();
      }
    } catch (error) {
      console.error('Error removing logo:', error);
      alert('Failed to remove logo');
    }
  };

  const saveColors = async () => {
    if (!settings) return;

    setSaving(true);
    try {
      const response = await fetch('/api/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ colors: settings.colors }),
      });

      if (response.ok) {
        alert('Colors saved successfully!');
      }
    } catch (error) {
      console.error('Error saving colors:', error);
      alert('Failed to save colors');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Site Settings</h2>
        <p className="text-muted-foreground">
          Configure your site's branding, logo, and appearance.
        </p>
      </div>

      <Tabs defaultValue="logo" className="w-full">
        <TabsList>
          <TabsTrigger value="logo">Logo</TabsTrigger>
          <TabsTrigger value="colors">Brand Colors</TabsTrigger>
        </TabsList>

        {/* Logo Settings */}
        <TabsContent value="logo" className="space-y-6">
          <div className="border rounded-lg p-6 bg-card space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Logo Management</h3>
              <p className="text-sm text-muted-foreground">
                Upload a logo file or use a CDN link.
              </p>
            </div>

            {/* Logo Type Toggle */}
            <div className="flex gap-4">
              <Button
                variant={logoType === 'file' ? 'default' : 'outline'}
                onClick={() => setLogoType('file')}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload File
              </Button>
              <Button
                variant={logoType === 'cdn' ? 'default' : 'outline'}
                onClick={() => setLogoType('cdn')}
              >
                <LinkIcon className="h-4 w-4 mr-2" />
                Use CDN Link
              </Button>
            </div>

            {/* Alt Text */}
            <div>
              <Label htmlFor="logoAlt">Alt Text (for accessibility)</Label>
              <Input
                id="logoAlt"
                value={logoAltText}
                onChange={(e) => setLogoAltText(e.target.value)}
                placeholder="Site logo"
              />
            </div>

            {/* File Upload */}
            {logoType === 'file' && (
              <div>
                <Label htmlFor="logoFile">Upload Logo File</Label>
                <Input
                  id="logoFile"
                  type="file"
                  accept="image/svg+xml,image/png,image/jpeg,image/webp"
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Supported formats: SVG, PNG, JPG, WEBP (Max 5MB)
                </p>
              </div>
            )}

            {/* CDN Link */}
            {logoType === 'cdn' && (
              <div>
                <Label htmlFor="cdnUrl">CDN URL</Label>
                <Input
                  id="cdnUrl"
                  value={cdnUrl}
                  onChange={(e) => setCdnUrl(e.target.value)}
                  placeholder="https://example.com/logo.svg"
                />
                <Button onClick={saveCdnLogo} disabled={saving} className="mt-4">
                  {saving ? 'Saving...' : 'Save CDN Logo'}
                </Button>
              </div>
            )}

            {/* Logo Preview */}
            {settings?.logo && (settings.logo.fileUrl || settings.logo.cdnUrl) && (
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">Current Logo</h4>
                  <Button variant="destructive" size="sm" onClick={removeLogo}>
                    <X className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>
                <div className="relative w-full h-24 bg-muted rounded flex items-center justify-center">
                  <Image
                    src={settings.logo.fileUrl || settings.logo.cdnUrl || ''}
                    alt={settings.logo.altText || 'Logo'}
                    width={settings.logo.width || 120}
                    height={settings.logo.height || 40}
                    className="max-h-20 w-auto"
                  />
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Brand Colors */}
        <TabsContent value="colors" className="space-y-6">
          <div className="border rounded-lg p-6 bg-card space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Brand Colors</h3>
              <p className="text-sm text-muted-foreground">
                Customize your site's color scheme.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="primary">Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="primary"
                    type="color"
                    value={settings?.colors.primary || '#0ea5e9'}
                    onChange={(e) =>
                      setSettings({
                        ...settings!,
                        colors: { ...settings!.colors, primary: e.target.value },
                      })
                    }
                    className="w-20 h-10"
                  />
                  <Input
                    value={settings?.colors.primary || '#0ea5e9'}
                    onChange={(e) =>
                      setSettings({
                        ...settings!,
                        colors: { ...settings!.colors, primary: e.target.value },
                      })
                    }
                    placeholder="#0ea5e9"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="secondary">Secondary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="secondary"
                    type="color"
                    value={settings?.colors.secondary || '#64748b'}
                    onChange={(e) =>
                      setSettings({
                        ...settings!,
                        colors: { ...settings!.colors, secondary: e.target.value },
                      })
                    }
                    className="w-20 h-10"
                  />
                  <Input
                    value={settings?.colors.secondary || '#64748b'}
                    onChange={(e) =>
                      setSettings({
                        ...settings!,
                        colors: { ...settings!.colors, secondary: e.target.value },
                      })
                    }
                    placeholder="#64748b"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="accent">Accent Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="accent"
                    type="color"
                    value={settings?.colors.accent || '#f59e0b'}
                    onChange={(e) =>
                      setSettings({
                        ...settings!,
                        colors: { ...settings!.colors, accent: e.target.value },
                      })
                    }
                    className="w-20 h-10"
                  />
                  <Input
                    value={settings?.colors.accent || '#f59e0b'}
                    onChange={(e) =>
                      setSettings({
                        ...settings!,
                        colors: { ...settings!.colors, accent: e.target.value },
                      })
                    }
                    placeholder="#f59e0b"
                  />
                </div>
              </div>
            </div>

            <Button onClick={saveColors} disabled={saving}>
              {saving ? 'Saving...' : 'Save Colors'}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

