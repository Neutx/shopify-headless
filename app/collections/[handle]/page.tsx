import { notFound } from 'next/navigation';
import { fetchCollectionByHandle } from '@/lib/shopify/collections';
import CollectionPageClient from './CollectionPageClient';

interface CollectionPageProps {
  params: Promise<{
    handle: string;
  }>;
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { handle } = await params;

  try {
    // Fetch collection from Shopify
    const collection = await fetchCollectionByHandle(handle);

    if (!collection) {
      notFound();
    }

    return <CollectionPageClient collection={collection} />;
  } catch (error) {
    console.error('Error loading collection:', error);
    notFound();
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: CollectionPageProps) {
  const { handle } = await params;
  
  try {
    const collection = await fetchCollectionByHandle(handle);

    if (!collection) {
      return {
        title: 'Collection Not Found',
      };
    }

    return {
      title: collection.title,
      description: collection.description,
      openGraph: {
        title: collection.title,
        description: collection.description,
        images: collection.image
          ? [
              {
                url: collection.image.url,
                alt: collection.image.altText || collection.title,
              },
            ]
          : [],
      },
    };
  } catch {
    return {
      title: 'Collection',
    };
  }
}

