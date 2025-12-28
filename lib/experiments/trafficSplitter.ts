import { getDocument, setDocument } from '@/lib/firebase/firestore';
import { COLLECTIONS } from '@/types/firebase';
import type { Experiment, ExperimentVariant, ExperimentSession } from '@/types/experiments';
import { Timestamp } from 'firebase/firestore';

/**
 * Assign a variant to a session based on traffic allocation
 */
export async function assignVariant(
  experimentId: string,
  productId: string,
  sessionId: string
): Promise<ExperimentVariant> {
  // Check if session already assigned
  const existingAssignment = await getSessionAssignment(sessionId, experimentId);
  if (existingAssignment) {
    return existingAssignment;
  }

  // Get experiment
  const experiment = await getExperiment(experimentId);

  if (!experiment || experiment.status !== 'running') {
    throw new Error('Experiment not found or not running');
  }

  // Weighted random selection based on traffic allocation
  const random = Math.random() * 100;
  let cumulative = 0;

  for (const variant of experiment.variants) {
    cumulative += variant.trafficAllocation;
    if (random <= cumulative) {
      // Assign and store
      await storeSessionAssignment(sessionId, experimentId, variant.id, productId);
      return variant;
    }
  }

  // Fallback to first variant
  const fallbackVariant = experiment.variants[0];
  await storeSessionAssignment(sessionId, experimentId, fallbackVariant.id, productId);
  return fallbackVariant;
}

/**
 * Get existing session assignment
 */
async function getSessionAssignment(
  sessionId: string,
  experimentId: string
): Promise<ExperimentVariant | null> {
  try {
    const sessionDoc = await getDocument<ExperimentSession>(
      COLLECTIONS.EXPERIMENT_SESSIONS,
      `${experimentId}_${sessionId}`
    );

    if (!sessionDoc) {
      return null;
    }

    const experiment = await getExperiment(experimentId);
    if (!experiment) {
      return null;
    }

    const variant = experiment.variants.find((v) => v.id === sessionDoc.variantId);
    return variant || null;
  } catch (error) {
    console.error('Error getting session assignment:', error);
    return null;
  }
}

/**
 * Store session assignment
 */
async function storeSessionAssignment(
  sessionId: string,
  experimentId: string,
  variantId: string,
  productId: string
): Promise<void> {
  const session: ExperimentSession = {
    sessionId,
    experimentId,
    variantId,
    productId,
    assignedAt: Timestamp.now(),
  };

  await setDocument(
    COLLECTIONS.EXPERIMENT_SESSIONS,
    `${experimentId}_${sessionId}`,
    session
  );
}

/**
 * Get experiment by ID
 */
async function getExperiment(experimentId: string): Promise<Experiment | null> {
  try {
    return await getDocument<Experiment>(COLLECTIONS.EXPERIMENTS, experimentId);
  } catch (error) {
    console.error('Error getting experiment:', error);
    return null;
  }
}

/**
 * Generate a unique session ID
 */
export function generateSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get or create session ID from localStorage
 */
export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') {
    return generateSessionId();
  }

  const storageKey = 'experiment_session_id';
  let sessionId = localStorage.getItem(storageKey);

  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem(storageKey, sessionId);
  }

  return sessionId;
}

