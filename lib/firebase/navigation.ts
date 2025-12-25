import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from './config';
import type { HeaderNavigation, FooterNavigation, NavigationItem } from '@/types/navigation';

const COLLECTIONS = {
  NAVIGATION: 'navigation',
} as const;

/**
 * Get header navigation items
 */
export async function getHeaderNavigation(): Promise<HeaderNavigation | null> {
  try {
    const docRef = doc(db, COLLECTIONS.NAVIGATION, 'header');
    const docSnap = await Promise.race([
      getDoc(docRef),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Firestore operation timeout after 5s')), 5000)
      )
    ]) as any;
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        items: data.items || [],
        updatedAt: data.updatedAt?.toDate(),
      };
    }
    
    // Return default empty navigation
    return { items: [] };
  } catch (error) {
    console.error('Error fetching header navigation:', error);
    // Return default instead of null to prevent UI breakage
    return { items: [] };
  }
}

/**
 * Update header navigation items
 */
export async function updateHeaderNavigation(items: NavigationItem[]): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.NAVIGATION, 'header');
    await setDoc(docRef, {
      items,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating header navigation:', error);
    throw error;
  }
}

/**
 * Get footer navigation
 */
export async function getFooterNavigation(): Promise<FooterNavigation | null> {
  try {
    const docRef = doc(db, COLLECTIONS.NAVIGATION, 'footer');
    const docSnap = await Promise.race([
      getDoc(docRef),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Firestore operation timeout after 5s')), 5000)
      )
    ]) as any;
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        sections: data.sections || [],
        socialLinks: data.socialLinks || [],
        newsletter: data.newsletter || { enabled: false, placeholder: 'Enter your email' },
        copyright: data.copyright,
        updatedAt: data.updatedAt?.toDate(),
      };
    }
    
    // Return default empty footer
    return {
      sections: [],
      socialLinks: [],
      newsletter: { enabled: false, placeholder: 'Enter your email' },
    };
  } catch (error) {
    console.error('Error fetching footer navigation:', error);
    // Return default instead of null
    return {
      sections: [],
      socialLinks: [],
      newsletter: { enabled: false, placeholder: 'Enter your email' },
    };
  }
}

/**
 * Update footer navigation
 */
export async function updateFooterNavigation(footer: Omit<FooterNavigation, 'updatedAt'>): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.NAVIGATION, 'footer');
    await setDoc(docRef, {
      ...footer,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating footer navigation:', error);
    throw error;
  }
}

