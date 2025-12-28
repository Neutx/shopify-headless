import type { SectionDefinition } from '@/types/sections';

export const reviewsSectionDefinition: SectionDefinition = {
  type: 'reviews',
  name: 'Customer Reviews',
  description: 'Display customer reviews and ratings for the product',
  icon: 'Star',
  category: 'Social Proof',
  defaultSettings: {
    title: 'Customer Reviews',
    showRating: true,
    reviewsPerPage: 5,
    sortOrder: 'recent',
    backgroundColor: 'transparent',
    showReviewForm: true,
    requireVerifiedPurchase: false,
  },
  settingsSchema: [
    {
      key: 'title',
      label: 'Section Title',
      type: 'text',
      default: 'Customer Reviews',
      placeholder: 'Enter section title',
      description: 'The heading displayed above the reviews',
    },
    {
      key: 'showRating',
      label: 'Show Average Rating',
      type: 'toggle',
      default: true,
      description: 'Display the overall product rating',
    },
    {
      key: 'reviewsPerPage',
      label: 'Reviews Per Page',
      type: 'number',
      default: 5,
      min: 1,
      max: 20,
      description: 'Number of reviews to show per page',
    },
    {
      key: 'sortOrder',
      label: 'Sort Order',
      type: 'select',
      default: 'recent',
      options: [
        { value: 'recent', label: 'Most Recent' },
        { value: 'helpful', label: 'Most Helpful' },
        { value: 'highest', label: 'Highest Rating' },
        { value: 'lowest', label: 'Lowest Rating' },
      ],
      description: 'Default sort order for reviews',
    },
    {
      key: 'backgroundColor',
      label: 'Background Color',
      type: 'color',
      default: 'transparent',
      description: 'Background color for the reviews section',
    },
    {
      key: 'showReviewForm',
      label: 'Show Review Form',
      type: 'toggle',
      default: true,
      description: 'Allow customers to submit new reviews',
    },
    {
      key: 'requireVerifiedPurchase',
      label: 'Require Verified Purchase',
      type: 'toggle',
      default: false,
      description: 'Only allow reviews from verified purchasers',
    },
  ],
};

