'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Linkedin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { FooterNavigation, NavigationItem } from '@/types/navigation';

const socialIcons = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  youtube: Youtube,
  linkedin: Linkedin,
};

export default function Footer() {
  const [footer, setFooter] = useState<FooterNavigation | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');

  useEffect(() => {
    async function fetchFooter() {
      try {
        const response = await fetch('/api/navigation/footer');
        const data = await response.json();
        setFooter(data.navigation);
      } catch (error) {
        console.error('Error fetching footer:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchFooter();
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

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    console.log('Newsletter subscription:', email);
    setEmail('');
  };

  if (loading) {
    return (
      <footer className="border-t bg-muted/40">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <div className="h-5 w-24 bg-muted animate-pulse rounded mb-4" />
                <div className="space-y-2">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="h-4 w-32 bg-muted animate-pulse rounded" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </footer>
    );
  }

  const sections = footer?.sections.sort((a, b) => a.order - b.order) || [];

  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Footer Sections */}
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-lg mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.items
                  .filter((item) => item.enabled !== false)
                  .sort((a, b) => a.order - b.order)
                  .map((item) => (
                    <li key={item.id}>
                      <Link
                        href={getItemHref(item) as any}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}

          {/* Newsletter Section */}
          {footer?.newsletter.enabled && (
            <div>
              <h3 className="font-semibold text-lg mb-4">
                {footer.newsletter.title || 'Newsletter'}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Subscribe to get special offers and updates.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <Input
                  type="email"
                  placeholder={footer.newsletter.placeholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1"
                />
                <Button type="submit">Subscribe</Button>
              </form>
            </div>
          )}
        </div>

        {/* Social Links & Copyright */}
        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Social Links */}
          {footer?.socialLinks && footer.socialLinks.length > 0 && (
            <div className="flex items-center gap-4">
              {footer.socialLinks
                .sort((a, b) => a.order - b.order)
                .map((social) => {
                  const IconComponent =
                    socialIcons[social.platform.toLowerCase() as keyof typeof socialIcons];
                  
                  if (!IconComponent) return null;

                  return (
                    <Link
                      key={social.platform}
                      href={social.url as any}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={social.platform}
                    >
                      <IconComponent className="h-5 w-5" />
                    </Link>
                  );
                })}
            </div>
          )}

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            {footer?.copyright || `© ${new Date().getFullYear()} All rights reserved.`}
          </p>
        </div>
      </div>
    </footer>
  );
}

