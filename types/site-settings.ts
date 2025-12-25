// Site settings types for CMS-controlled branding

export interface LogoSettings {
  type: 'file' | 'cdn';
  fileUrl?: string; // Firebase Storage URL if type is 'file'
  cdnUrl?: string; // CDN link if type is 'cdn'
  altText?: string;
  width?: number;
  height?: number;
}

export interface BrandColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  border: string;
}

export interface SiteSettings {
  logo: LogoSettings;
  colors: BrandColors;
  siteName?: string;
  siteDescription?: string;
  updatedAt?: Date;
}

// Input types for admin panel
export interface UpdateLogoInput {
  type: 'file' | 'cdn';
  fileUrl?: string;
  cdnUrl?: string;
  altText?: string;
  width?: number;
  height?: number;
}

export interface UpdateColorsInput {
  primary?: string;
  secondary?: string;
  accent?: string;
  background?: string;
  foreground?: string;
  muted?: string;
  mutedForeground?: string;
  border?: string;
}

