// Navigation types for CMS-controlled header and footer

export interface NavigationItem {
  id: string;
  label: string;
  type: 'collection' | 'product' | 'url' | 'dropdown';
  link?: string; // URL for external links
  collectionHandle?: string; // Shopify collection handle
  productHandle?: string; // Shopify product handle
  order: number;
  children?: NavigationItem[]; // For dropdown menus
  enabled?: boolean; // Toggle visibility
}

export interface HeaderNavigation {
  items: NavigationItem[];
  updatedAt?: Date;
}

export interface SocialLink {
  platform: string; // facebook, twitter, instagram, etc.
  url: string;
  icon?: string;
  order: number;
}

export interface FooterSection {
  title: string;
  items: NavigationItem[];
  order: number;
}

export interface FooterNavigation {
  sections: FooterSection[];
  socialLinks: SocialLink[];
  newsletter: {
    enabled: boolean;
    placeholder: string;
    title?: string;
  };
  copyright?: string;
  updatedAt?: Date;
}

