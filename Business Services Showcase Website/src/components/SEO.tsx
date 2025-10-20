import React, { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'service';
  twitterCard?: 'summary' | 'summary_large_image';
  structuredData?: Record<string, any>;
  noindex?: boolean;
  nofollow?: boolean;
}

interface ServiceSEOProps {
  serviceId: string;
  serviceName: string;
  serviceDescription: string;
  servicePrice?: {
    min: number;
    max?: number;
    currency: string;
  };
  serviceCategory: string;
  rating?: number;
  reviewCount?: number;
}

// Main SEO Component
export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords = [],
  canonicalUrl,
  ogImage,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  structuredData,
  noindex = false,
  nofollow = false
}) => {
  useEffect(() => {
    // Update document title
    if (title) {
      document.title = title;
    }

    // Update meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords.join(', '));
    updateMetaTag('robots', getRobotsContent(noindex, nofollow));

    // Open Graph tags
    updateMetaTag('og:title', title, 'property');
    updateMetaTag('og:description', description, 'property');
    updateMetaTag('og:type', ogType, 'property');
    updateMetaTag('og:url', canonicalUrl || window.location.href, 'property');
    if (ogImage) {
      updateMetaTag('og:image', ogImage, 'property');
      updateMetaTag('og:image:alt', title || 'Revenue Avenue', 'property');
    }

    // Twitter Card tags
    updateMetaTag('twitter:card', twitterCard);
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    if (ogImage) {
      updateMetaTag('twitter:image', ogImage);
    }

    // Canonical URL
    if (canonicalUrl) {
      updateCanonicalLink(canonicalUrl);
    }

    // Structured Data
    if (structuredData) {
      updateStructuredData(structuredData);
    }

    return () => {
      // Cleanup is handled by the next render
    };
  }, [title, description, keywords, canonicalUrl, ogImage, ogType, twitterCard, structuredData, noindex, nofollow]);

  return null; // This component doesn't render anything
};

// Service-specific SEO Component
export const ServiceSEO: React.FC<ServiceSEOProps> = ({
  serviceId,
  serviceName,
  serviceDescription,
  servicePrice,
  serviceCategory,
  rating = 4.9,
  reviewCount = 127
}) => {
  const title = `${serviceName} | Revenue Avenue - Business Growth Services`;
  const description = `${serviceDescription} Professional business consulting services by Revenue Avenue. Transform your business with our proven systems.`;
  const keywords = [
    'business consulting',
    'revenue growth',
    'business services',
    serviceName.toLowerCase(),
    serviceCategory.toLowerCase(),
    'entrepreneur coaching',
    'business scaling',
    'profit optimization'
  ];

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: serviceName,
    description: serviceDescription,
    provider: {
      '@type': 'Organization',
      name: 'Revenue Avenue',
      url: 'https://revenueavenue.com',
      logo: 'https://revenueavenue.com/logo.png',
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+1-555-REVENUE',
        contactType: 'Customer Service',
        email: 'contact@revenueavenue.com'
      }
    },
    category: serviceCategory,
    url: `https://revenueavenue.com/services/${serviceId}`,
    ...(servicePrice && {
      offers: {
        '@type': 'Offer',
        priceCurrency: servicePrice.currency,
        price: servicePrice.min,
        ...(servicePrice.max && {
          priceRange: `${servicePrice.min}-${servicePrice.max}`
        }),
        availability: 'https://schema.org/InStock',
        validFrom: new Date().toISOString().split('T')[0]
      }
    }),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: rating,
      reviewCount: reviewCount,
      bestRating: '5',
      worstRating: '1'
    }
  };

  return (
    <SEO
      title={title}
      description={description}
      keywords={keywords}
      canonicalUrl={`https://revenueavenue.com/services/${serviceId}`}
      ogType="service"
      structuredData={structuredData}
    />
  );
};

// Homepage SEO Component
export const HomepageSEO: React.FC = () => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Revenue Avenue',
    description: 'Transform your business from side hustle to multi-million dollar empire with comprehensive business consulting services.',
    url: 'https://revenueavenue.com',
    logo: 'https://revenueavenue.com/logo.png',
    image: 'https://revenueavenue.com/og-image.jpg',
    telephone: '+1-555-REVENUE',
    email: 'contact@revenueavenue.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Business District',
      addressRegion: 'State',
      postalCode: '12345',
      addressCountry: 'US'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '40.7128',
      longitude: '-74.0060'
    },
    openingHours: 'Mo-Fr 09:00-18:00',
    priceRange: '$$$',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '127',
      bestRating: '5',
      worstRating: '1'
    },
    serviceType: [
      'Business Consulting',
      'Revenue Optimization',
      'Business Scaling',
      'Profit Maximization',
      'Strategic Planning'
    ],
    areaServed: {
      '@type': 'Place',
      name: 'Worldwide'
    }
  };

  return (
    <SEO
      title="Revenue Avenue - Transform Your Business Into a Multi-Million Dollar Empire"
      description="Professional business consulting services to scale your business from side hustle to 7-figure empire. Proven systems, expert guidance, guaranteed results."
      keywords={[
        'business consulting',
        'revenue growth',
        'business scaling',
        'profit optimization',
        'entrepreneur coaching',
        'business transformation',
        'side hustle to empire',
        'business growth services'
      ]}
      canonicalUrl="https://revenueavenue.com"
      ogImage="https://revenueavenue.com/og-homepage.jpg"
      structuredData={structuredData}
    />
  );
};

// Utility Functions
const updateMetaTag = (name: string, content?: string, attribute: string = 'name'): void => {
  if (!content) return;

  let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
  
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  
  element.setAttribute('content', content);
};

const updateCanonicalLink = (url: string): void => {
  let element = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }
  
  element.setAttribute('href', url);
};

const updateStructuredData = (data: Record<string, any>): void => {
  // Remove existing structured data
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.remove();
  }

  // Add new structured data
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
};

const getRobotsContent = (noindex: boolean, nofollow: boolean): string => {
  const directives = [];
  
  if (noindex) directives.push('noindex');
  else directives.push('index');
  
  if (nofollow) directives.push('nofollow');
  else directives.push('follow');
  
  return directives.join(', ');
};

// Performance SEO Component
export const PerformanceSEO: React.FC = () => {
  useEffect(() => {
    // Add preconnect hints for external resources
    addPreconnectHint('https://fonts.googleapis.com');
    addPreconnectHint('https://fonts.gstatic.com');
    addPreconnectHint('https://analytics.google.com');

    // Add DNS prefetch hints
    addDNSPrefetch('https://www.google-analytics.com');
    addDNSPrefetch('https://fonts.googleapis.com');

    // Add preload hints for critical resources
    addPreloadHint('/logo.svg', 'image');
    addPreloadHint('/styles/globals.css', 'style');

    // Critical Web Vitals monitoring
    if ('web-vital' in window) {
      // Implement Web Vitals tracking
      const vitalsScript = document.createElement('script');
      vitalsScript.src = 'https://unpkg.com/web-vitals@3/dist/web-vitals.js';
      vitalsScript.onload = () => {
        // @ts-ignore
        webVitals.getCLS(sendToAnalytics);
        // @ts-ignore
        webVitals.getFID(sendToAnalytics);
        // @ts-ignore
        webVitals.getFCP(sendToAnalytics);
        // @ts-ignore
        webVitals.getLCP(sendToAnalytics);
        // @ts-ignore
        webVitals.getTTFB(sendToAnalytics);
      };
      document.head.appendChild(vitalsScript);
    }
  }, []);

  return null;
};

const addPreconnectHint = (href: string): void => {
  if (document.querySelector(`link[rel="preconnect"][href="${href}"]`)) return;
  
  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = href;
  document.head.appendChild(link);
};

const addDNSPrefetch = (href: string): void => {
  if (document.querySelector(`link[rel="dns-prefetch"][href="${href}"]`)) return;
  
  const link = document.createElement('link');
  link.rel = 'dns-prefetch';
  link.href = href;
  document.head.appendChild(link);
};

const addPreloadHint = (href: string, as: string): void => {
  if (document.querySelector(`link[rel="preload"][href="${href}"]`)) return;
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.setAttribute('as', as);
  document.head.appendChild(link);
};

const sendToAnalytics = (metric: any): void => {
  // Send Web Vitals to your analytics service
  console.log('Web Vital:', metric);
  
  // Example: Send to Google Analytics
  if (typeof gtag !== 'undefined') {
    gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
    });
  }
};

// SEO Hook for page-level optimization
export const useSEO = (pageData: {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
}) => {
  useEffect(() => {
    const seoTitle = `${pageData.title} | Revenue Avenue`;
    document.title = seoTitle;

    updateMetaTag('description', pageData.description);
    if (pageData.keywords) {
      updateMetaTag('keywords', pageData.keywords.join(', '));
    }
    if (pageData.canonical) {
      updateCanonicalLink(pageData.canonical);
    }

    // Track page view for SEO analytics
    if (typeof gtag !== 'undefined') {
      gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: seoTitle,
        page_location: window.location.href
      });
    }
  }, [pageData]);
};