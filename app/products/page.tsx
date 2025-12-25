import { redirect } from 'next/navigation';

/**
 * Redirect /products to home page
 * Individual product pages are at /products/[handle]
 */
export default function ProductsPage() {
  redirect('/');
}

