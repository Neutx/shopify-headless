import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { app } from './config';

const storage = getStorage(app);

const LOGO_PATH = 'logos';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/webp'];

/**
 * Validate file before upload
 */
export function validateLogoFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Only SVG, PNG, JPG, and WEBP are allowed.',
    };
  }
  
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: 'File size exceeds 5MB limit.',
    };
  }
  
  return { valid: true };
}

/**
 * Upload logo to Firebase Storage
 */
export async function uploadLogo(file: File): Promise<string> {
  try {
    // Validate file
    const validation = validateLogoFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const filename = `logo-${timestamp}.${extension}`;
    
    // Create storage reference
    const storageRef = ref(storage, `${LOGO_PATH}/${filename}`);
    
    // Upload file
    await uploadBytes(storageRef, file, {
      contentType: file.type,
    });
    
    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading logo:', error);
    throw error;
  }
}

/**
 * Delete logo from Firebase Storage
 */
export async function deleteLogo(fileUrl: string): Promise<void> {
  try {
    // Extract path from URL
    const url = new URL(fileUrl);
    const pathMatch = url.pathname.match(/\/o\/(.+)\?/);
    
    if (!pathMatch) {
      throw new Error('Invalid file URL');
    }
    
    const path = decodeURIComponent(pathMatch[1]);
    const storageRef = ref(storage, path);
    
    // Delete file
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting logo:', error);
    throw error;
  }
}

/**
 * Get public URL for a logo
 */
export async function getLogoUrl(path: string): Promise<string> {
  try {
    const storageRef = ref(storage, path);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error('Error getting logo URL:', error);
    throw error;
  }
}

