import { shopifyFetch } from './client';
import {
  GET_COLLECTION_BY_HANDLE,
  GET_ALL_COLLECTIONS,
} from './queries';
import {
  CollectionByHandleResponse,
  AllCollectionsResponse,
  ShopifyCollection,
  CleanCollection,
} from '@/types/shopify';
import { cleanProduct } from './products';
import { retryWithBackoff } from '@/lib/utils/retry';

/**
 * Transform Shopify collection to clean format
 */
export function cleanCollection(collection: ShopifyCollection): CleanCollection {
  return {
    id: collection.id,
    title: collection.title,
    handle: collection.handle,
    description: collection.description,
    descriptionHtml: collection.descriptionHtml,
    image: collection.image,
    products: collection.products.edges.map(edge => cleanProduct(edge.node)),
  };
}

/**
 * Fetch a collection by its handle
 */
export async function fetchCollectionByHandle(
  handle: string,
  productLimit: number = 50
): Promise<CleanCollection | null> {
  try {
    const response = await retryWithBackoff(async () => {
      return await shopifyFetch<CollectionByHandleResponse>(
        GET_COLLECTION_BY_HANDLE,
        {
          handle,
          first: productLimit,
        }
      );
    });

    if (!response.collectionByHandle) {
      return null;
    }

    return cleanCollection(response.collectionByHandle);
  } catch (error) {
    console.error(`Error fetching collection by handle ${handle}:`, error);
    throw error;
  }
}

/**
 * Fetch all collections with pagination support
 */
export async function fetchAllCollections(
  limit: number = 50,
  cursor?: string
): Promise<{
  collections: Omit<CleanCollection, 'products'>[];
  hasNextPage: boolean;
  endCursor: string | null;
}> {
  try {
    const response = await retryWithBackoff(async () => {
      return await shopifyFetch<AllCollectionsResponse>(GET_ALL_COLLECTIONS, {
        first: limit,
        after: cursor || null,
      });
    });

    const collections = response.collections.edges.map(edge => ({
      id: edge.node.id,
      title: edge.node.title,
      handle: edge.node.handle,
      description: edge.node.description,
      descriptionHtml: edge.node.descriptionHtml,
      image: edge.node.image,
      products: [], // Products not included in the list view
    }));

    return {
      collections,
      hasNextPage: response.collections.pageInfo.hasNextPage,
      endCursor: response.collections.pageInfo.endCursor,
    };
  } catch (error) {
    console.error('Error fetching all collections:', error);
    throw error;
  }
}

/**
 * Fetch all collections recursively
 */
export async function fetchAllCollectionsRecursive(): Promise<
  Omit<CleanCollection, 'products'>[]
> {
  const allCollections: Omit<CleanCollection, 'products'>[] = [];
  let hasNextPage = true;
  let cursor: string | null = null;

  while (hasNextPage) {
    const result = await fetchAllCollections(50, cursor || undefined);
    allCollections.push(...result.collections);
    hasNextPage = result.hasNextPage;
    cursor = result.endCursor;

    // Add a small delay to avoid rate limiting
    if (hasNextPage) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  return allCollections;
}

