'use client';

import { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AddToCartButtonProps {
  variantId: string;
  quantity: number;
  disabled?: boolean;
  className?: string;
}

export default function AddToCartButton({
  variantId,
  quantity,
  disabled = false,
  className,
}: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    
    try {
      // TODO: Implement add to cart logic
      console.log('Adding to cart:', { variantId, quantity });
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={disabled || isAdding}
      className={className}
      size="lg"
    >
      {isAdded ? (
        <>
          <Check className="mr-2 h-5 w-5" />
          Added to Cart
        </>
      ) : (
        <>
          <ShoppingCart className="mr-2 h-5 w-5" />
          {isAdding ? 'Adding...' : 'Add to Cart'}
        </>
      )}
    </Button>
  );
}

