'use client';

import Logo from './Logo';
import Navigation from './Navigation';
import MobileMenu from './MobileMenu';
import CartIcon from './CartIcon';
import LanguageSelector from './LanguageSelector';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Mobile Menu */}
          <div className="flex items-center gap-4">
            <MobileMenu />
            
            {/* Logo */}
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <Navigation />

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            <LanguageSelector />
            <CartIcon itemCount={0} />
          </div>
        </div>
      </div>
    </header>
  );
}

