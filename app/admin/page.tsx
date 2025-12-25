import Link from 'next/link';
import { Settings, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2">Welcome to Admin Panel</h2>
        <p className="text-muted-foreground">
          Manage your store's content, navigation, and settings from here.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Navigation Card */}
        <div className="border rounded-lg p-6 space-y-4 bg-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Navigation className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Navigation</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Manage header and footer navigation menus. Add, edit, or remove menu items
            and organize them with drag-and-drop.
          </p>
          <Button asChild>
            <Link href="/admin/navigation">Manage Navigation</Link>
          </Button>
        </div>

        {/* Site Settings Card */}
        <div className="border rounded-lg p-6 space-y-4 bg-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Settings className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Site Settings</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Configure your site's logo, brand colors, and general settings. Upload a
            logo or use a CDN link.
          </p>
          <Button asChild>
            <Link href="/admin/site-settings">Manage Settings</Link>
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="border rounded-lg p-6 bg-card">
        <h3 className="text-xl font-semibold mb-4">Quick Stats</h3>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Products</p>
            <p className="text-2xl font-bold">-</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Collections</p>
            <p className="text-2xl font-bold">-</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Orders</p>
            <p className="text-2xl font-bold">-</p>
          </div>
        </div>
      </div>
    </div>
  );
}

