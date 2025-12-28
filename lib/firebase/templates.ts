import { Timestamp } from 'firebase/firestore';
import {
  COLLECTIONS,
  Template,
  CreateTemplateInput,
  UpdateTemplateInput,
} from '@/types/firebase';
import type { Section } from '@/types/sections';
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
    // Build template object, excluding undefined values
    const template: any = {
      templateId,
      name: input.name,
      sections: input.sections || [],
      createdAt: Timestamp.now(),
    };

    // Only add optional fields if they have values
    if (input.description) {
      template.description = input.description;
    }
    if (input.previewImage) {
      template.previewImage = input.previewImage;
    }

    await setDocument(COLLECTIONS.TEMPLATES, templateId, template);
    
    return {
      ...template,
      updatedAt: Timestamp.now(),
    } as Template;
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
    // Remove undefined values to prevent Firestore errors
    const cleanUpdates: any = {
      updatedAt: Timestamp.now(),
    };

    if (updates.name !== undefined) {
      cleanUpdates.name = updates.name;
    }
    if (updates.description !== undefined) {
      cleanUpdates.description = updates.description;
    }
    if (updates.previewImage !== undefined) {
      cleanUpdates.previewImage = updates.previewImage;
    }
    if (updates.sections !== undefined) {
      cleanUpdates.sections = updates.sections;
    }

    await updateDocument(COLLECTIONS.TEMPLATES, templateId, cleanUpdates);
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

/**
 * Update template sections
 */
export async function updateTemplateSections(
  templateId: string,
  sections: Section[]
): Promise<void> {
  try {
    await updateDocument(COLLECTIONS.TEMPLATES, templateId, {
      sections,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating template sections:', error);
    throw error;
  }
}

/**
 * Add a section to a template
 */
export async function addTemplateSection(
  templateId: string,
  section: Section
): Promise<void> {
  try {
    const template = await getTemplate(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    const updatedSections = [...template.sections, section];
    await updateTemplateSections(templateId, updatedSections);
  } catch (error) {
    console.error('Error adding template section:', error);
    throw error;
  }
}

/**
 * Remove a section from a template
 */
export async function removeTemplateSection(
  templateId: string,
  sectionId: string
): Promise<void> {
  try {
    const template = await getTemplate(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    const updatedSections = template.sections.filter((s) => s.id !== sectionId);
    await updateTemplateSections(templateId, updatedSections);
  } catch (error) {
    console.error('Error removing template section:', error);
    throw error;
  }
}

/**
 * Update a specific section in a template
 */
export async function updateTemplateSection(
  templateId: string,
  sectionId: string,
  updates: Partial<Section>
): Promise<void> {
  try {
    const template = await getTemplate(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    const updatedSections = template.sections.map((section) =>
      section.id === sectionId ? { ...section, ...updates } : section
    );
    await updateTemplateSections(templateId, updatedSections);
  } catch (error) {
    console.error('Error updating template section:', error);
    throw error;
  }
}

