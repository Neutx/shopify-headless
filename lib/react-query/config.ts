import { QueryClient } from '@tanstack/react-query';

// Query keys for consistent cache management
export const queryKeys = {
  products: {
    all: ['products'] as const,
    byHandle: (handle: string) => ['products', 'handle', handle] as const,
    byId: (id: string) => ['products', 'id', id] as const,
  },
  collections: {
    all: ['collections'] as const,
    byHandle: (handle: string) => ['collections', 'handle', handle] as const,
  },
  templates: {
    all: ['templates'] as const,
    byId: (id: string) => ['templates', id] as const,
  },
  productTemplates: {
    all: ['product-templates'] as const,
    byId: (productId: string) => ['product-templates', productId] as const,
  },
} as const;

// Default query client configuration
export const defaultQueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
      retry: 3,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
};

// Create a new query client instance
export function createQueryClient(): QueryClient {
  return new QueryClient(defaultQueryClientConfig);
}

