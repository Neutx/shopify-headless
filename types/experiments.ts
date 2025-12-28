import { Timestamp } from 'firebase/firestore';

export interface ExperimentVariant {
  id: string;
  name: string;
  templateId: string;
  trafficAllocation: number; // Percentage (0-100)
}

export interface Experiment {
  experimentId: string;
  name: string;
  description?: string;
  status: 'draft' | 'running' | 'paused' | 'completed';
  variants: ExperimentVariant[];
  productIds: string[]; // Products included in experiment
  startDate?: Timestamp;
  endDate?: Timestamp;
  goalMetric: 'conversion' | 'addToCart' | 'revenue' | 'engagement';
  minSampleSize: number;
  confidenceLevel: number; // 90, 95, 99
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

export interface ExperimentSession {
  sessionId: string;
  experimentId: string;
  variantId: string;
  productId: string;
  assignedAt: Timestamp;
  userId?: string;
}

export interface ConversionEvent {
  eventId: string;
  experimentId: string;
  variantId: string;
  sessionId: string;
  productId: string;
  eventType: 'view' | 'addToCart' | 'purchase' | 'click';
  metadata?: Record<string, any>;
  revenue?: number;
  timestamp: Timestamp;
}

export interface ExperimentResults {
  experimentId: string;
  variantResults: Record<string, VariantMetrics>;
  winner?: string;
  statisticalSignificance: number; // p-value
  recommendedAction: 'continue' | 'declare_winner' | 'stop';
}

export interface VariantMetrics {
  variantId: string;
  impressions: number;
  conversions: number;
  conversionRate: number;
  revenue: number;
  averageOrderValue: number;
  confidenceInterval: [number, number];
}

