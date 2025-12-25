'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { NavigationItem } from '@/types/navigation';

export default function MobileMenu() {
  const [navItems, setNavItems] = useState<NavigationItem[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function fetchNavigation() {
      try {
        const response = await fetch('/api/navigation/header');
        const data = await response.json();
        setNavItems(data.navigation?.items || []);
      } catch (error) {
        console.error('Error fetching navigation:', error);
      }
    }

    fetchNavigation();
  }, []);

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

  const visibleItems = navItems
    .filter((item) => item.enabled !== false)
    .sort((a, b) => a.order - b.order);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav className="mt-6">
          <Accordion type="single" collapsible className="w-full">
            {visibleItems.map((item, index) => {
              if (item.type === 'dropdown' && item.children && item.children.length > 0) {
                return (
                  <AccordionItem key={item.id} value={`item-${index}`}>
                    <AccordionTrigger className="text-sm font-medium">
                      {item.label}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col gap-2 pl-4">
                        {item.children.map((child) => (
                          <Link
                            key={child.id}
                            href={getItemHref(child) as any}
                            className="text-sm py-2 hover:text-primary transition-colors"
                            onClick={() => setOpen(false)}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              }

              return (
                <div key={item.id} className="py-3 border-b">
                  <Link
                    href={getItemHref(item) as any}
                    className="text-sm font-medium hover:text-primary transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                </div>
              );
            })}
          </Accordion>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

