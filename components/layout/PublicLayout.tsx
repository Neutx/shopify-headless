'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [showHeaderFooter, setShowHeaderFooter] = useState(true);
  
  useEffect(() => {
    // Show Header/Footer for all routes EXCEPT admin and preview
    const isAdminRoute = pathname?.startsWith('/admin');
    const isPreviewRoute = pathname?.startsWith('/preview');
    setShowHeaderFooter(!isAdminRoute && !isPreviewRoute);
  }, [pathname]);
  
  if (!showHeaderFooter) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

