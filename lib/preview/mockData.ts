// Mock data for template preview

export interface MockProduct {
  id: string;
  title: string;
  description: string;
  handle: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: Array<{
    url: string;
    altText: string;
  }>;
  rating?: number;
  reviewCount?: number;
  variants?: Array<{
    id: string;
    title: string;
    price: string;
    availableForSale: boolean;
  }>;
}

export const MOCK_PRODUCT: MockProduct = {
  id: 'mock-product-1',
  title: 'Premium Ergonomic Office Chair',
  description: 'Experience ultimate comfort and productivity with our premium ergonomic office chair. Designed with your health and comfort in mind, featuring adjustable lumbar support, breathable mesh back, and premium cushioning.',
  handle: 'premium-ergonomic-office-chair',
  priceRange: {
    minVariantPrice: {
      amount: '299.99',
      currencyCode: 'USD',
    },
  },
  images: [
    { 
      url: 'https://placehold.co/1200x1200/3b82f6/ffffff?text=Chair+Front+View', 
      altText: 'Premium office chair front view' 
    },
    { 
      url: 'https://placehold.co/1200x1200/8b5cf6/ffffff?text=Chair+Side+View', 
      altText: 'Premium office chair side view' 
    },
    { 
      url: 'https://placehold.co/1200x1200/ec4899/ffffff?text=Chair+Back+View', 
      altText: 'Premium office chair back view' 
    },
    { 
      url: 'https://placehold.co/1200x1200/10b981/ffffff?text=Chair+Detail', 
      altText: 'Premium office chair detail' 
    },
  ],
  rating: 4.5,
  reviewCount: 127,
  variants: [
    {
      id: 'variant-1',
      title: 'Black',
      price: '299.99',
      availableForSale: true,
    },
    {
      id: 'variant-2',
      title: 'White',
      price: '299.99',
      availableForSale: true,
    },
    {
      id: 'variant-3',
      title: 'Gray',
      price: '299.99',
      availableForSale: false,
    },
  ],
};

export const MOCK_REVIEWS = [
  {
    id: 'review-1',
    author: 'Sarah Johnson',
    rating: 5,
    title: 'Best chair I\'ve ever owned!',
    content: 'This chair has completely transformed my work-from-home experience. The lumbar support is exceptional and I can sit comfortably for hours.',
    date: '2024-01-15',
    verified: true,
  },
  {
    id: 'review-2',
    author: 'Michael Chen',
    rating: 4,
    title: 'Great quality, worth the price',
    content: 'Very comfortable and well-built. The only minor issue is the assembly instructions could be clearer.',
    date: '2024-01-10',
    verified: true,
  },
  {
    id: 'review-3',
    author: 'Emma Rodriguez',
    rating: 5,
    title: 'Perfect for long work sessions',
    content: 'As someone who sits at a desk all day, this chair is a game-changer. No more back pain!',
    date: '2024-01-05',
    verified: true,
  },
];

export const MOCK_RELATED_PRODUCTS: MockProduct[] = [
  {
    id: 'mock-product-2',
    title: 'Adjustable Standing Desk',
    description: 'Premium electric standing desk with memory presets',
    handle: 'adjustable-standing-desk',
    priceRange: {
      minVariantPrice: {
        amount: '599.99',
        currencyCode: 'USD',
      },
    },
    images: [
      { url: 'https://placehold.co/600x600/3b82f6/ffffff?text=Standing+Desk', altText: 'Standing desk' },
    ],
    rating: 4.7,
    reviewCount: 89,
  },
  {
    id: 'mock-product-3',
    title: 'Monitor Arm Mount',
    description: 'Dual monitor mount with gas spring arm',
    handle: 'monitor-arm-mount',
    priceRange: {
      minVariantPrice: {
        amount: '149.99',
        currencyCode: 'USD',
      },
    },
    images: [
      { url: 'https://placehold.co/600x600/8b5cf6/ffffff?text=Monitor+Arm', altText: 'Monitor arm' },
    ],
    rating: 4.3,
    reviewCount: 54,
  },
  {
    id: 'mock-product-4',
    title: 'Ergonomic Keyboard',
    description: 'Split ergonomic mechanical keyboard',
    handle: 'ergonomic-keyboard',
    priceRange: {
      minVariantPrice: {
        amount: '189.99',
        currencyCode: 'USD',
      },
    },
    images: [
      { url: 'https://placehold.co/600x600/ec4899/ffffff?text=Keyboard', altText: 'Ergonomic keyboard' },
    ],
    rating: 4.6,
    reviewCount: 102,
  },
  {
    id: 'mock-product-5',
    title: 'Footrest',
    description: 'Adjustable ergonomic footrest',
    handle: 'ergonomic-footrest',
    priceRange: {
      minVariantPrice: {
        amount: '49.99',
        currencyCode: 'USD',
      },
    },
    images: [
      { url: 'https://placehold.co/600x600/10b981/ffffff?text=Footrest', altText: 'Footrest' },
    ],
    rating: 4.4,
    reviewCount: 67,
  },
];

/**
 * Get mock data for a specific section type
 */
export function getMockDataForSection(sectionType: string): any {
  switch (sectionType) {
    case 'reviews':
      return {
        product: MOCK_PRODUCT,
        reviews: MOCK_REVIEWS,
      };
    case 'hero':
    case 'gallery':
    case 'specs':
      return {
        product: MOCK_PRODUCT,
      };
    case 'relatedProducts':
      return {
        products: MOCK_RELATED_PRODUCTS,
      };
    default:
      return {
        product: MOCK_PRODUCT,
      };
  }
}

/**
 * Get full mock product data
 */
export function getMockProduct(): MockProduct {
  return MOCK_PRODUCT;
}

/**
 * Get mock reviews
 */
export function getMockReviews() {
  return MOCK_REVIEWS;
}

/**
 * Get mock related products
 */
export function getMockRelatedProducts(): MockProduct[] {
  return MOCK_RELATED_PRODUCTS;
}

