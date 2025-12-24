import { Timestamp } from 'firebase/firestore';
import {
  COLLECTIONS,
  Template,
  CreateTemplateInput,
  UpdateTemplateInput,
} from '@/types/firebase';
import {
  getDocument,
  getAllDocuments,
  setDocument,
  updateDocument,
  deleteDocument,
} from './firestore';

/**
 * Get a template by ID
 */
export async function getTemplate(templateId: string): Promise<Template | null> {
  try {
    return await getDocument<Template>(COLLECTIONS.TEMPLATES, templateId);
  } catch (error) {
    console.error('Error fetching template:', error);
    return null;
  }
}

/**
 * Get all templates
 */
export async function getAllTemplates(): Promise<Template[]> {
  try {
    return await getAllDocuments<Template>(COLLECTIONS.TEMPLATES);
  } catch (error) {
    console.error('Error fetching all templates:', error);
    return [];
  }
}

/**
 * Create a new template
 */
export async function createTemplate(
  templateId: string,
  input: CreateTemplateInput
): Promise<Template> {
  try {
    const template: Omit<Template, 'updatedAt'> = {
      templateId,
      name: input.name,
      component: input.component,
      description: input.description,
      previewImage: input.previewImage,
      createdAt: Timestamp.now(),
    };

    await setDocument(COLLECTIONS.TEMPLATES, templateId, template);
    
    return {
      ...template,
      updatedAt: Timestamp.now(),
    };
  } catch (error) {
    console.error('Error creating template:', error);
    throw error;
  }
}

/**
 * Update an existing template
 */
export async function updateTemplate(
  templateId: string,
  updates: UpdateTemplateInput
): Promise<void> {
  try {
    await updateDocument(COLLECTIONS.TEMPLATES, templateId, updates);
  } catch (error) {
    console.error('Error updating template:', error);
    throw error;
  }
}

/**
 * Delete a template
 */
export async function deleteTemplate(templateId: string): Promise<void> {
  try {
    await deleteDocument(COLLECTIONS.TEMPLATES, templateId);
  } catch (error) {
    console.error('Error deleting template:', error);
    throw error;
  }
}

/**
 * Check if a template exists
 */
export async function templateExists(templateId: string): Promise<boolean> {
  try {
    const template = await getTemplate(templateId);
    return template !== null;
  } catch (error) {
    console.error('Error checking template existence:', error);
    return false;
  }
}

