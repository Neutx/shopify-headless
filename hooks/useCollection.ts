'use client';

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { queryKeys } from '@/lib/react-query/config';
import {
  fetchCollectionByHandle,
  fetchAllCollections,
} from '@/lib/shopify/collections';
import { CleanCollection } from '@/types/shopify';

/**
 * Hook to fetch a collection by handle
 */
export function useCollection(
  handle: string,
  productLimit: number = 50
): UseQueryResult<CleanCollection | null, Error> {
  return useQuery({
    queryKey: queryKeys.collections.byHandle(handle),
    queryFn: () => fetchCollectionByHandle(handle, productLimit),
    enabled: !!handle,
    staleTime: 5 * 60 * 1000, // 5 minutes for collection data
  });
}

/**
 * Hook to fetch all collections with pagination
 */
export function useAllCollections(
  limit: number = 50,
  cursor?: string
): UseQueryResult<
  {
    collections: Omit<CleanCollection, 'products'>[];
    hasNextPage: boolean;
    endCursor: string | null;
  },
  Error
> {
  return useQuery({
    queryKey: [...queryKeys.collections.all, limit, cursor],
    queryFn: () => fetchAllCollections(limit, cursor),
    staleTime: 10 * 60 * 1000, // 10 minutes for collection lists (they change less frequently)
  });
}

