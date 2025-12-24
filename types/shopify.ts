// Shopify API Types

export interface ShopifyImage {
  id: string;
  url: string;
  altText?: string;
  width: number;
  height: number;
}

export interface ShopifyMoneyV2 {
  amount: string;
  currencyCode: string;
}

export interface ShopifyProductVariant {
  id: string;
  title: string;
  price: ShopifyMoneyV2;
  compareAtPrice?: ShopifyMoneyV2;
  availableForSale: boolean;
  quantityAvailable?: number;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  image?: ShopifyImage;
  sku?: string;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  images: {
    edges: Array<{
      node: ShopifyImage;
    }>;
  };
  variants: {
    edges: Array<{
      node: ShopifyProductVariant;
    }>;
  };
  priceRange: {
    minVariantPrice: ShopifyMoneyV2;
    maxVariantPrice: ShopifyMoneyV2;
  };
  availableForSale: boolean;
  tags: string[];
  productType: string;
  vendor: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  image?: ShopifyImage;
  products: {
    edges: Array<{
      node: ShopifyProduct;
    }>;
  };
}

// GraphQL Response Types
export interface ProductByHandleResponse {
  productByHandle: ShopifyProduct | null;
}

export interface ProductByIdResponse {
  product: ShopifyProduct | null;
}

export interface AllProductsResponse {
  products: {
    edges: Array<{
      node: ShopifyProduct;
    }>;
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
  };
}

export interface CollectionByHandleResponse {
  collectionByHandle: ShopifyCollection | null;
}

export interface AllCollectionsResponse {
  collections: {
    edges: Array<{
      node: ShopifyCollection;
    }>;
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
  };
}

// API Error Types
export interface ShopifyAPIError {
  message: string;
  extensions?: {
    code: string;
    [key: string]: any;
  };
}

export interface ShopifyErrorResponse {
  errors?: ShopifyAPIError[];
  data?: null;
}

// Utility type for cleaner product data
export interface CleanProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  images: ShopifyImage[];
  variants: ShopifyProductVariant[];
  minPrice: ShopifyMoneyV2;
  maxPrice: ShopifyMoneyV2;
  availableForSale: boolean;
  tags: string[];
  productType: string;
  vendor: string;
  createdAt: string;
  updatedAt: string;
}

export interface CleanCollection {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  image?: ShopifyImage;
  products: CleanProduct[];
}

