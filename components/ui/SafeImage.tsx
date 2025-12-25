'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface SafeImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

/**
 * Safe Image component that falls back to unoptimized mode if optimization fails
 * Detects optimization failures by checking if the optimized image URL returns an error
 */
export function SafeImage({
  src,
  alt,
  fill,
  width,
  height,
  className,
  priority,
  sizes,
}: SafeImageProps) {
  const [useUnoptimized, setUseUnoptimized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if this image URL has failed before (stored in sessionStorage)
    let failedImages = JSON.parse(sessionStorage.getItem('failedImages') || '[]');
    if (failedImages.includes(src)) {
      setUseUnoptimized(true);
      setIsChecking(false);
      return;
    }

    // For problematic image patterns, use unoptimized immediately
    // Check for images with complex filenames that might cause issues
    const problematicPatterns = [
      /\.bip\./i, // Files with .bip. in name
      /[._]{3,}/, // Multiple consecutive dots/underscores
      /_[bB]\d+\./i, // Files like _b2.png, _B3.png (Kast_b2.png pattern)
      /Kast_/i, // Specific Kast pattern
      /swarm_pass_through/i, // Swarm pattern
    ];

    const matchedPattern = problematicPatterns.find((pattern) => pattern.test(src));
    const hasProblematicPattern = !!matchedPattern;

    if (hasProblematicPattern) {
      // Cache this decision
      if (!failedImages.includes(src)) {
        failedImages.push(src);
        sessionStorage.setItem('failedImages', JSON.stringify(failedImages));
      }
      setUseUnoptimized(true);
      setIsChecking(false);
      return;
    }

    // Try to preload the optimized image to detect failures (with short timeout)
    const optimizedUrl = `/_next/image?url=${encodeURIComponent(src)}&w=${width || 1080}&q=75`;
    
    // Use AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout
    
    // Check if optimized image is accessible
    fetch(optimizedUrl, { method: 'HEAD', signal: controller.signal })
      .then((response) => {
        clearTimeout(timeoutId);
        if (!response.ok) {
          // Optimization failed, use unoptimized
          failedImages = JSON.parse(sessionStorage.getItem('failedImages') || '[]');
          if (!failedImages.includes(src)) {
            failedImages.push(src);
            sessionStorage.setItem('failedImages', JSON.stringify(failedImages));
          }
          setUseUnoptimized(true);
        }
      })
      .catch(() => {
        clearTimeout(timeoutId);
        // On error or timeout, use unoptimized and cache
        failedImages = JSON.parse(sessionStorage.getItem('failedImages') || '[]');
        if (!failedImages.includes(src)) {
          failedImages.push(src);
          sessionStorage.setItem('failedImages', JSON.stringify(failedImages));
        }
        setUseUnoptimized(true);
      })
      .finally(() => {
        setIsChecking(false);
      });
  }, [src, width]);

  // Show placeholder while checking
  if (isChecking && !useUnoptimized) {
    return (
      <div
        className={`bg-muted animate-pulse ${className || ''}`}
        style={fill ? undefined : { width, height }}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      className={className}
      priority={priority}
      sizes={sizes}
      unoptimized={useUnoptimized}
      onError={() => {
        // Fallback if image still fails
        if (!useUnoptimized) {
          setUseUnoptimized(true);
        }
      }}
    />
  );
}

