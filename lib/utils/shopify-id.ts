/**
 * Sanitize Shopify GID for use as Firestore document ID
 * Shopify IDs are in format: gid://shopify/Product/123456
 * Firestore doesn't allow // in document IDs
 */
export function sanitizeShopifyId(gid: string): string {
  // Replace // with __ to make it Firestore-safe
  return gid.replace(/\//g, '_');
}

/**
 * Convert sanitized ID back to Shopify GID format
 */
export function unsanitizeShopifyId(sanitizedId: string): string {
  // Replace __ back to / (but keep the first _ as it's part of gid_)
  return sanitizedId.replace(/_/g, '/').replace('gid:/', 'gid://');
}

