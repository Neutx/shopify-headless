'use client';

import { useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { queryKeys } from '@/lib/react-query/config';
import {
  fetchProductByHandle,
  fetchProductById,
  fetchAllProducts,
} from '@/lib/shopify/products';
import { CleanProduct } from '@/types/shopify';

/**
 * Hook to fetch a product by handle
 */
export function useProduct(handle: string): UseQueryResult<CleanProduct | null, Error> {
  return useQuery({
    queryKey: queryKeys.products.byHandle(handle),
    queryFn: () => fetchProductByHandle(handle),
    enabled: !!handle,
    staleTime: 5 * 60 * 1000, // 5 minutes for product data
  });
}

/**
 * Hook to fetch a product by ID
 */
export function useProductById(id: string): UseQueryResult<CleanProduct | null, Error> {
  return useQuery({
    queryKey: queryKeys.products.byId(id),
    queryFn: () => fetchProductById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch all products with pagination
 */
export function useAllProducts(
  limit: number = 50,
  cursor?: string
): UseQueryResult<
  {
    products: CleanProduct[];
    hasNextPage: boolean;
    endCursor: string | null;
  },
  Error
> {
  return useQuery({
    queryKey: [...queryKeys.products.all, limit, cursor],
    queryFn: () => fetchAllProducts(limit, cursor),
    staleTime: 2 * 60 * 1000, // 2 minutes for product lists
  });
}

/**
 * Hook to prefetch a product by handle (useful for hover states)
 */
export function usePrefetchProduct() {
  const queryClient = useQueryClient();

  return (handle: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.products.byHandle(handle),
      queryFn: () => fetchProductByHandle(handle),
      staleTime: 5 * 60 * 1000,
    });
  };
}

