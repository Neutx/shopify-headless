import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from './config';
import type { SiteSettings, UpdateLogoInput, UpdateColorsInput } from '@/types/site-settings';

const COLLECTIONS = {
  SITE_SETTINGS: 'site-settings',
} as const;

/**
 * Get site settings
 */
export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const docRef = doc(db, COLLECTIONS.SITE_SETTINGS, 'general');
    const docSnap = await Promise.race([
      getDoc(docRef),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Firestore operation timeout after 5s')), 5000)
      )
    ]) as any;
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        logo: data.logo || { type: 'file' },
        colors: data.colors || getDefaultColors(),
        siteName: data.siteName,
        siteDescription: data.siteDescription,
        updatedAt: data.updatedAt?.toDate(),
      };
    }
    
    // Return default settings
    return {
      logo: { type: 'file' },
      colors: getDefaultColors(),
    };
  } catch (error) {
    console.error('Error fetching site settings:', error);
    // Return default settings instead of null
    return {
      logo: { type: 'file' },
      colors: getDefaultColors(),
    };
  }
}

/**
 * Update logo settings
 */
export async function updateLogo(logoSettings: UpdateLogoInput): Promise<void> {
  try {
    const currentSettings = await getSiteSettings();
    const docRef = doc(db, COLLECTIONS.SITE_SETTINGS, 'general');
    
    // Filter out undefined values from logo settings (Firestore doesn't allow undefined)
    const cleanLogoSettings: Record<string, any> = {
      type: logoSettings.type,
    };
    
    if (logoSettings.fileUrl !== undefined) cleanLogoSettings.fileUrl = logoSettings.fileUrl;
    if (logoSettings.cdnUrl !== undefined) cleanLogoSettings.cdnUrl = logoSettings.cdnUrl;
    if (logoSettings.altText !== undefined) cleanLogoSettings.altText = logoSettings.altText;
    if (logoSettings.width !== undefined) cleanLogoSettings.width = logoSettings.width;
    if (logoSettings.height !== undefined) cleanLogoSettings.height = logoSettings.height;
    
    await setDoc(docRef, {
      ...currentSettings,
      logo: cleanLogoSettings,
      updatedAt: Timestamp.now(),
    }, { merge: true });
  } catch (error) {
    console.error('Error updating logo:', error);
    throw error;
  }
}

/**
 * Update brand colors
 */
export async function updateColors(colors: UpdateColorsInput): Promise<void> {
  try {
    const currentSettings = await getSiteSettings();
    const docRef = doc(db, COLLECTIONS.SITE_SETTINGS, 'general');
    
    await setDoc(docRef, {
      ...currentSettings,
      colors: {
        ...currentSettings?.colors,
        ...colors,
      },
      updatedAt: Timestamp.now(),
    }, { merge: true });
  } catch (error) {
    console.error('Error updating colors:', error);
    throw error;
  }
}

/**
 * Update site info (name, description)
 */
export async function updateSiteInfo(siteName?: string, siteDescription?: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.SITE_SETTINGS, 'general');
    
    await setDoc(docRef, {
      siteName,
      siteDescription,
      updatedAt: Timestamp.now(),
    }, { merge: true });
  } catch (error) {
    console.error('Error updating site info:', error);
    throw error;
  }
}

/**
 * Get default brand colors
 */
function getDefaultColors() {
  return {
    primary: '#0ea5e9', // sky-500
    secondary: '#64748b', // slate-500
    accent: '#f59e0b', // amber-500
    background: '#ffffff',
    foreground: '#0f172a',
    muted: '#f1f5f9',
    mutedForeground: '#64748b',
    border: '#e2e8f0',
  };
}

