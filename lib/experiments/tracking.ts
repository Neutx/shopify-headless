'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { setDocument } from '@/lib/firebase/firestore';
import { COLLECTIONS } from '@/types/firebase';
import type { ConversionEvent, ExperimentVariant } from '@/types/experiments';
import { Timestamp } from 'firebase/firestore';
import { assignVariant, getOrCreateSessionId } from './trafficSplitter';

/**
 * Track a conversion event
 */
export async function trackConversion(
  sessionId: string,
  experimentId: string,
  variantId: string,
  eventType: 'view' | 'addToCart' | 'purchase' | 'click',
  metadata?: Record<string, any>
): Promise<void> {
  try {
    const event: Omit<ConversionEvent, 'eventId' | 'timestamp'> = {
      experimentId,
      variantId,
      sessionId,
      productId: metadata?.productId || '',
      eventType,
      metadata,
      revenue: metadata?.revenue,
    };

    const eventId = `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await setDocument(COLLECTIONS.CONVERSION_EVENTS, eventId, {
      ...event,
      eventId,
      timestamp: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error tracking conversion:', error);
  }
}

/**
 * React hook for experiment tracking
 */
export function useExperimentTracking(experimentId: string, productId: string) {
  const sessionId = useMemo(() => getOrCreateSessionId(), []);
  const [variant, setVariant] = useState<ExperimentVariant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function assignAndTrack() {
      try {
        const assignedVariant = await assignVariant(experimentId, productId, sessionId);
        setVariant(assignedVariant);
        
        // Track view event automatically
        await trackConversion(sessionId, experimentId, assignedVariant.id, 'view', {
          productId,
        });
      } catch (error) {
        console.error('Error assigning variant:', error);
      } finally {
        setLoading(false);
      }
    }

    assignAndTrack();
  }, [experimentId, productId, sessionId]);

  const trackEvent = useCallback(
    async (eventType: 'addToCart' | 'purchase' | 'click', metadata?: any) => {
      if (variant) {
        await trackConversion(sessionId, experimentId, variant.id, eventType, {
          ...metadata,
          productId,
        });
      }
    },
    [variant, sessionId, experimentId, productId]
  );

  return { variant, trackEvent, loading };
}

