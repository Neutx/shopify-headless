import { GraphQLClient } from 'graphql-request';

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
  console.warn(
    'Shopify credentials not found. Please set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN in your environment variables.'
  );
}

const endpoint = SHOPIFY_STORE_DOMAIN
  ? `https://${SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`
  : '';

export const shopifyClient = new GraphQLClient(endpoint, {
  headers: {
    'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN || '',
    'Content-Type': 'application/json',
  },
});

/**
 * Execute a GraphQL query against the Shopify Storefront API
 */
export async function shopifyFetch<T>(
  query: string,
  variables?: Record<string, any>
): Promise<T> {
  try {
    if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
      throw new Error('Shopify credentials are not configured');
    }

    const data = await shopifyClient.request<T>(query, variables);
    return data;
  } catch (error: any) {
    console.error('Shopify API Error:', error);
    throw new Error(`Shopify API Error: ${error.message}`);
  }
}

