'use client';

import { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Section } from '@/types/sections';

interface Review {
  id: string;
  author: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
  helpful: number;
}

// Mock reviews data (in production, this would come from an API)
const mockReviews: Review[] = [
  {
    id: '1',
    author: 'John D.',
    rating: 5,
    title: 'Excellent Product!',
    comment: 'This product exceeded my expectations. Great quality and fast shipping.',
    date: '2024-01-15',
    verified: true,
    helpful: 12,
  },
  {
    id: '2',
    author: 'Sarah M.',
    rating: 4,
    title: 'Good value',
    comment: 'Overall satisfied with the purchase. Would recommend to others.',
    date: '2024-01-10',
    verified: true,
    helpful: 8,
  },
  {
    id: '3',
    author: 'Mike R.',
    rating: 5,
    title: 'Love it!',
    comment: 'Perfect! Exactly what I was looking for.',
    date: '2024-01-05',
    verified: false,
    helpful: 5,
  },
];

interface ReviewsSectionProps {
  section: Section;
  productId?: string;
}

export default function ReviewsSection({ section, productId: _productId }: ReviewsSectionProps) {
  const settings = section.settings;
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState(settings.sortOrder || 'recent');

  // Calculate statistics
  const averageRating = mockReviews.length > 0
    ? mockReviews.reduce((sum, r) => sum + r.rating, 0) / mockReviews.length
    : 0;
  const totalReviews = mockReviews.length;

  // Sort reviews
  const sortedReviews = [...mockReviews].sort((a, b) => {
    switch (sortBy) {
      case 'helpful':
        return b.helpful - a.helpful;
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      case 'recent':
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  // Pagination
  const reviewsPerPage = settings.reviewsPerPage || 5;
  const totalPages = Math.ceil(sortedReviews.length / reviewsPerPage);
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const paginatedReviews = sortedReviews.slice(startIndex, startIndex + reviewsPerPage);

  // Render star rating
  const renderStars = (rating: number, size = 'sm') => {
    const sizeClass = size === 'lg' ? 'h-6 w-6' : 'h-4 w-4';
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        ))}
      </div>
    );
  };

  const backgroundColor = settings.backgroundColor === 'transparent'
    ? 'transparent'
    : settings.backgroundColor;

  return (
    <section
      className="py-12"
      style={{ backgroundColor }}
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-4">{settings.title}</h2>
          
          {settings.showRating && (
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                {renderStars(Math.round(averageRating), 'lg')}
                <span className="text-2xl font-bold">{averageRating.toFixed(1)}</span>
              </div>
              <span className="text-muted-foreground">
                Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
              </span>
            </div>
          )}

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <Label htmlFor="sort-reviews" className="text-sm">Sort by:</Label>
            <select
              id="sort-reviews"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border rounded-md px-3 py-1 text-sm"
            >
              <option value="recent">Most Recent</option>
              <option value="helpful">Most Helpful</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-6 mb-8">
          {paginatedReviews.map((review) => (
            <div key={review.id} className="border rounded-lg p-6 bg-card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {renderStars(review.rating)}
                    {review.verified && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg">{review.title}</h3>
                </div>
                <span className="text-sm text-muted-foreground">
                  {new Date(review.date).toLocaleDateString()}
                </span>
              </div>
              
              <p className="text-muted-foreground mb-4">{review.comment}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{review.author}</span>
                <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <ThumbsUp className="h-4 w-4" />
                  Helpful ({review.helpful})
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Review Form */}
        {settings.showReviewForm && (
          <div className="mt-12 border-t pt-8">
            <h3 className="text-2xl font-bold mb-6">Write a Review</h3>
            <form className="space-y-4 max-w-2xl">
              <div>
                <Label htmlFor="review-rating">Rating</Label>
                <div className="flex gap-2 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="hover:scale-110 transition-transform"
                    >
                      <Star className="h-8 w-8 fill-gray-200 text-gray-200 hover:fill-yellow-400 hover:text-yellow-400" />
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <Label htmlFor="review-title">Review Title</Label>
                <Input
                  id="review-title"
                  placeholder="Summarize your experience"
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="review-comment">Your Review</Label>
                <textarea
                  id="review-comment"
                  rows={4}
                  placeholder="Share your thoughts about this product"
                  className="mt-2 w-full border rounded-md px-3 py-2"
                />
              </div>
              
              <div>
                <Label htmlFor="review-name">Your Name</Label>
                <Input
                  id="review-name"
                  placeholder="Enter your name"
                  className="mt-2"
                />
              </div>
              
              {settings.requireVerifiedPurchase && (
                <p className="text-sm text-muted-foreground">
                  * Only verified purchasers can submit reviews
                </p>
              )}
              
              <Button type="submit">Submit Review</Button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}

