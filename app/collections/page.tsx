import { redirect } from 'next/navigation';

/**
 * Redirect /collections to home page
 * Individual collection pages are at /collections/[handle]
 */
export default function CollectionsPage() {
  redirect('/');
}

