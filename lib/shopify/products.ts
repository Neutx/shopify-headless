import { shopifyFetch } from './client';
import {
  GET_PRODUCT_BY_HANDLE,
  GET_PRODUCT_BY_ID,
  GET_ALL_PRODUCTS,
} from './queries';
import {
  ProductByHandleResponse,
  ProductByIdResponse,
  AllProductsResponse,
  ShopifyProduct,
  CleanProduct,
} from '@/types/shopify';
import { retryWithBackoff } from '@/lib/utils/retry';

/**
 * Transform Shopify product to clean format
 */
export function cleanProduct(product: ShopifyProduct): CleanProduct {
  return {
    id: product.id,
    title: product.title,
    handle: product.handle,
    description: product.description,
    descriptionHtml: product.descriptionHtml,
    images: product.images.edges.map(edge => edge.node),
    variants: product.variants.edges.map(edge => edge.node),
    minPrice: product.priceRange.minVariantPrice,
    maxPrice: product.priceRange.maxVariantPrice,
    availableForSale: product.availableForSale,
    tags: product.tags,
    productType: product.productType,
    vendor: product.vendor,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

/**
 * Fetch a product by its handle
 */
export async function fetchProductByHandle(handle: string): Promise<CleanProduct | null> {
  try {
    const response = await retryWithBackoff(async () => {
      return await shopifyFetch<ProductByHandleResponse>(GET_PRODUCT_BY_HANDLE, {
        handle,
      });
    });

    if (!response.productByHandle) {
      return null;
    }

    return cleanProduct(response.productByHandle);
  } catch (error) {
    console.error(`Error fetching product by handle ${handle}:`, error);
    throw error;
  }
}

/**
 * Fetch a product by its ID
 */
export async function fetchProductById(id: string): Promise<CleanProduct | null> {
  try {
    const response = await retryWithBackoff(async () => {
      return await shopifyFetch<ProductByIdResponse>(GET_PRODUCT_BY_ID, { id });
    });

    if (!response.product) {
      return null;
    }

    return cleanProduct(response.product);
  } catch (error) {
    console.error(`Error fetching product by ID ${id}:`, error);
    throw error;
  }
}

/**
 * Fetch all products with pagination support
 */
export async function fetchAllProducts(
  limit: number = 50,
  cursor?: string
): Promise<{
  products: CleanProduct[];
  hasNextPage: boolean;
  endCursor: string | null;
}> {
  try {
    const response = await retryWithBackoff(async () => {
      return await shopifyFetch<AllProductsResponse>(GET_ALL_PRODUCTS, {
        first: limit,
        after: cursor || null,
      });
    });

    const products = response.products.edges.map(edge => cleanProduct(edge.node));

    return {
      products,
      hasNextPage: response.products.pageInfo.hasNextPage,
      endCursor: response.products.pageInfo.endCursor,
    };
  } catch (error) {
    console.error('Error fetching all products:', error);
    throw error;
  }
}

/**
 * Fetch all products recursively (for sync purposes)
 */
export async function fetchAllProductsRecursive(): Promise<CleanProduct[]> {
  const allProducts: CleanProduct[] = [];
  let hasNextPage = true;
  let cursor: string | null = null;

  while (hasNextPage) {
    const result = await fetchAllProducts(50, cursor || undefined);
    allProducts.push(...result.products);
    hasNextPage = result.hasNextPage;
    cursor = result.endCursor;

    // Add a small delay to avoid rate limiting
    if (hasNextPage) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  return allProducts;
}

