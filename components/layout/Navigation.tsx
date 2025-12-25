'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { NavigationItem } from '@/types/navigation';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';

export default function Navigation() {
  const [navItems, setNavItems] = useState<NavigationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNavigation() {
      try {
        const response = await fetch('/api/navigation/header');
        const data = await response.json();
        setNavItems(data.navigation?.items || []);
      } catch (error) {
        console.error('Error fetching navigation:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchNavigation();
  }, []);

  if (loading) {
    return (
      <nav className="hidden md:flex items-center gap-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-4 w-20 bg-muted animate-pulse rounded" />
        ))}
      </nav>
    );
  }

  const getItemHref = (item: NavigationItem): string => {
    if (item.type === 'url' && item.link) return item.link;
    if (item.type === 'collection' && item.collectionHandle) {
      return `/collections/${item.collectionHandle}`;
    }
    if (item.type === 'product' && item.productHandle) {
      return `/products/${item.productHandle}`;
    }
    return '#';
  };

  // Filter enabled items and sort by order
  const visibleItems = navItems
    .filter((item) => item.enabled !== false)
    .sort((a, b) => a.order - b.order);

  return (
    <nav className="hidden md:flex items-center gap-1">
      {visibleItems.map((item) => {
        if (item.type === 'dropdown' && item.children && item.children.length > 0) {
          return (
            <NavigationMenu key={item.id}>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium">
                    {item.label}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {item.children.map((child) => (
                        <li key={child.id}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={getItemHref(child) as any}
                              className={cn(
                                'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground'
                              )}
                            >
                              <div className="text-sm font-medium leading-none">
                                {child.label}
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          );
        }

        return (
          <Link
            key={item.id}
            href={getItemHref(item) as any}
            className="text-sm font-medium px-4 py-2 rounded-md hover:bg-muted transition-colors"
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

