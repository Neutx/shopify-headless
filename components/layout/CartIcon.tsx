'use client';

import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import type { Route } from 'next';

interface CartIconProps {
  itemCount?: number;
}

export default function CartIcon({ itemCount = 0 }: CartIconProps) {
  return (
    <Link
      href={"/cart" as Route}
      className="relative flex items-center justify-center p-2 hover:bg-muted rounded-md transition-colors"
      aria-label="Shopping cart"
    >
      <ShoppingCart className="h-6 w-6" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </Link>
  );
}

