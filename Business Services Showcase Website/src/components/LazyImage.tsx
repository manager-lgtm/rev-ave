import React, { useState, useRef, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
  priority?: boolean;
  sizes?: string;
  width?: number;
  height?: number;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  placeholder,
  blurDataURL,
  onLoad,
  onError,
  priority = false,
  sizes,
  width,
  height,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const [currentSrc, setCurrentSrc] = useState(placeholder || blurDataURL || '');

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px 0px', // Load images 50px before they come into view
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  // Update src when image comes into view
  useEffect(() => {
    if (isInView && !hasError) {
      setCurrentSrc(src);
    }
  }, [isInView, src, hasError]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(false);
    onError?.();
  };

  // Generate optimized sizes if not provided
  const optimizedSizes = sizes || (width ? `${width}px` : '100vw');

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{ 
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : 'auto'
      }}
    >
      {/* Placeholder/Loading State */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse">
          {blurDataURL && (
            <img
              src={blurDataURL}
              alt=""
              className="w-full h-full object-cover opacity-50 blur-sm"
              aria-hidden="true"
            />
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-[var(--ra-gold)] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      )}

      {/* Main Image */}
      {isInView && (
        <ImageWithFallback
          src={currentSrc}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleLoad}
          onError={handleError}
          sizes={optimizedSizes}
          width={width}
          height={height}
          {...props}
        />
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
          <div className="text-center p-4">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-slate-200 flex items-center justify-center">
              <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm text-slate-500">Image unavailable</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Utility for generating optimized image URLs (placeholder for future CDN integration)
export const getOptimizedImageUrl = (src: string, width?: number, height?: number, quality = 80) => {
  // In production, this would integrate with a CDN like Cloudinary, Vercel, or similar
  // For now, return the original src
  return src;
};

// Utility for generating blur data URLs
export const generateBlurDataURL = (src: string): string => {
  // Placeholder for blur data URL generation
  // In production, this could generate a low-quality placeholder
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="300" fill="#f1f5f9"/>
      <text x="50%" y="50%" text-anchor="middle" dy="0.3em" fill="#64748b" font-size="16">Loading...</text>
    </svg>
  `)}`;
};