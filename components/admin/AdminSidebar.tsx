'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { usePathname } from 'next/navigation';
import { 
  Layout, 
  Navigation, 
  Layers, 
  Settings, 
  ChevronLeft, 
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  // Persist state
  useEffect(() => {
    const savedState = localStorage.getItem('adminSidebarCollapsed');
    if (savedState) {
      setCollapsed(JSON.parse(savedState));
    }
  }, []);

  const toggleCollapsed = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem('adminSidebarCollapsed', JSON.stringify(newState));
  };

  const navItems = [
    {
      href: '/admin',
      label: 'Dashboard',
      icon: Layout
    },
    {
      href: '/admin/navigation',
      label: 'Navigation',
      icon: Navigation
    },
    {
      href: '/admin/templates',
      label: 'Templates',
      icon: Layers
    },
    {
      href: '/admin/site-settings',
      label: 'Site Settings',
      icon: Settings
    }
  ];

  return (
    <aside 
      className={cn(
        "bg-card border-r h-screen sticky top-0 transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header with Admin Panel title and collapse button */}
      <div className="border-b p-3 flex items-center justify-between">
        {!collapsed && (
          <h1 className="text-xl font-bold">Admin Panel</h1>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleCollapsed}
          className="ml-auto"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 py-4 px-3 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href as Route}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-accent hover:text-accent-foreground",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
