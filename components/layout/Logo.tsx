'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { LogoSettings } from '@/types/site-settings';

export default function Logo() {
  const [logo, setLogo] = useState<LogoSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchLogo() {
      try {
        const response = await fetch('/api/logo');
        const data = await response.json();
        setLogo(data.logo);
      } catch (err) {
        console.error('Error fetching logo:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchLogo();
  }, []);

  if (loading) {
    return (
      <Link href="/" className="flex items-center">
        <div className="h-8 w-32 bg-muted animate-pulse rounded" />
      </Link>
    );
  }

  // Show default text logo if no logo or error
  if (error || !logo || (!logo.fileUrl && !logo.cdnUrl)) {
    return (
      <Link href="/" className="text-2xl font-bold">
        Store
      </Link>
    );
  }

  const logoSrc = logo.type === 'file' ? logo.fileUrl : logo.cdnUrl;

  if (!logoSrc) {
    return (
      <Link href="/" className="text-2xl font-bold">
        Store
      </Link>
    );
  }

  return (
    <Link href="/" className="flex items-center">
      <Image
        src={logoSrc}
        alt={logo.altText || 'Logo'}
        width={logo.width || 120}
        height={logo.height || 40}
        className="h-auto w-auto max-h-10"
        priority
        onError={() => setError(true)}
      />
    </Link>
  );
}

