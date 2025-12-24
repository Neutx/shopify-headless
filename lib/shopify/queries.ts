// GraphQL fragment for product fields
const PRODUCT_FRAGMENT = `
  fragment ProductFields on Product {
    id
    title
    handle
    description
    descriptionHtml
    availableForSale
    tags
    productType
    vendor
    createdAt
    updatedAt
    images(first: 10) {
      edges {
        node {
          id
          url
          altText
          width
          height
        }
      }
    }
    variants(first: 50) {
      edges {
        node {
          id
          title
          availableForSale
          quantityAvailable
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
          image {
            id
            url
            altText
            width
            height
          }
          sku
        }
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
  }
`;

// GraphQL fragment for collection fields
const COLLECTION_FRAGMENT = `
  fragment CollectionFields on Collection {
    id
    title
    handle
    description
    descriptionHtml
    image {
      id
      url
      altText
      width
      height
    }
  }
`;

/**
 * Query to get a product by handle
 */
export const GET_PRODUCT_BY_HANDLE = `
  ${PRODUCT_FRAGMENT}
  query getProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      ...ProductFields
    }
  }
`;

/**
 * Query to get a product by ID
 */
export const GET_PRODUCT_BY_ID = `
  ${PRODUCT_FRAGMENT}
  query getProductById($id: ID!) {
    product(id: $id) {
      ...ProductFields
    }
  }
`;

/**
 * Query to get all products with pagination
 */
export const GET_ALL_PRODUCTS = `
  ${PRODUCT_FRAGMENT}
  query getAllProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      edges {
        node {
          ...ProductFields
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

/**
 * Query to get a collection by handle
 */
export const GET_COLLECTION_BY_HANDLE = `
  ${COLLECTION_FRAGMENT}
  ${PRODUCT_FRAGMENT}
  query getCollectionByHandle($handle: String!, $first: Int!) {
    collectionByHandle(handle: $handle) {
      ...CollectionFields
      products(first: $first) {
        edges {
          node {
            ...ProductFields
          }
        }
      }
    }
  }
`;

/**
 * Query to get all collections with pagination
 */
export const GET_ALL_COLLECTIONS = `
  ${COLLECTION_FRAGMENT}
  query getAllCollections($first: Int!, $after: String) {
    collections(first: $first, after: $after) {
      edges {
        node {
          ...CollectionFields
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

/**
 * Query to search products
 */
export const SEARCH_PRODUCTS = `
  ${PRODUCT_FRAGMENT}
  query searchProducts($query: String!, $first: Int!) {
    products(first: $first, query: $query) {
      edges {
        node {
          ...ProductFields
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

