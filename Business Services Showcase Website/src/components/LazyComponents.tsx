import React, { Suspense, useCallback } from 'react';
import { ErrorBoundary } from './ErrorBoundary';

// Lazy load components with proper error boundaries and loading states
const ServicesListingLazy = React.lazy(() => 
  import('./ServicesListing').then(module => ({ 
    default: module.ServicesListing 
  })).catch(error => {
    console.error('Failed to load ServicesListing:', error);
    return { default: () => <div>Failed to load services. Please refresh the page.</div> };
  })
);

const ServiceDetailLazy = React.lazy(() => 
  import('./ServiceDetail').then(module => ({ 
    default: module.ServiceDetail 
  })).catch(error => {
    console.error('Failed to load ServiceDetail:', error);
    return { default: () => <div>Failed to load service details. Please refresh the page.</div> };
  })
);

const ContactFormLazy = React.lazy(() => 
  import('./ContactForm').then(module => ({ 
    default: module.ContactForm 
  })).catch(error => {
    console.error('Failed to load ContactForm:', error);
    return { default: () => <div>Failed to load contact form. Please refresh the page.</div> };
  })
);

const ServiceComparisonLazy = React.lazy(() => 
  import('./ServiceComparison').then(module => ({ 
    default: module.ServiceComparison 
  })).catch(error => {
    console.error('Failed to load ServiceComparison:', error);
    return { default: () => <div>Failed to load comparison. Please refresh the page.</div> };
  })
);

const ServiceRecommenderLazy = React.lazy(() => 
  import('./ServiceRecommender').then(module => ({ 
    default: module.ServiceRecommender 
  })).catch(error => {
    console.error('Failed to load ServiceRecommender:', error);
    return { default: () => <div>Failed to load recommender. Please refresh the page.</div> };
  })
);

const ServiceBundlesLazy = React.lazy(() => 
  import('./ServiceBundles').then(module => ({ 
    default: module.ServiceBundles 
  })).catch(error => {
    console.error('Failed to load ServiceBundles:', error);
    return { default: () => <div>Failed to load bundles. Please refresh the page.</div> };
  })
);

const ServiceAssessmentLazy = React.lazy(() => 
  import('./ServiceAssessment').then(module => ({ 
    default: module.ServiceAssessment 
  })).catch(error => {
    console.error('Failed to load ServiceAssessment:', error);
    return { default: () => <div>Failed to load assessment. Please refresh the page.</div> };
  })
);

const FAQSearchLazy = React.lazy(() => 
  import('./FAQSearch').then(module => ({ 
    default: module.FAQSearch 
  })).catch(error => {
    console.error('Failed to load FAQSearch:', error);
    return { default: () => <div>Failed to load FAQ. Please refresh the page.</div> };
  })
);

const SocialProofLazy = React.lazy(() => 
  import('./SocialProof').then(module => ({ 
    default: module.SocialProof 
  })).catch(error => {
    console.error('Failed to load SocialProof:', error);
    return { default: () => <div>Failed to load social proof. Please refresh the page.</div> };
  })
);

// Enhanced loading component with Revenue Avenue branding
const ComponentLoader: React.FC<{ 
  componentName: string;
  size?: 'sm' | 'md' | 'lg';
  fullPage?: boolean;
}> = ({ 
  componentName, 
  size = 'md',
  fullPage = false 
}) => {
  const sizeClasses = {
    sm: 'min-h-[200px]',
    md: 'min-h-[400px]',
    lg: 'min-h-[600px]'
  };

  const containerClasses = fullPage 
    ? 'min-h-screen flex items-center justify-center' 
    : `${sizeClasses[size]} flex items-center justify-center`;

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center space-y-4 p-8">
        {/* Animated Logo */}
        <div className="relative">
          <div className="w-16 h-16 ra-logo rounded-xl flex items-center justify-center animate-pulse">
            <span className="text-white font-bold text-lg">RA</span>
          </div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-[var(--ra-gold)] border-t-transparent rounded-xl animate-spin"></div>
        </div>
        
        {/* Loading Text */}
        <div className="text-center space-y-2">
          <h3 className="font-semibold text-lg text-[var(--ra-olive)]">
            Loading {componentName}...
          </h3>
          <p className="text-sm text-gray-600">
            Preparing your business growth experience
          </p>
        </div>
        
        {/* Progress Indicator */}
        <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[var(--ra-lime)] to-[var(--ra-gold)] rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

// Wrapper components with enhanced error boundaries and loading states
export const ServicesListing: React.FC<any> = (props) => (
  <ErrorBoundary>
    <Suspense fallback={<ComponentLoader componentName="Services" size="lg" />}>
      <ServicesListingLazy {...props} />
    </Suspense>
  </ErrorBoundary>
);

export const ServiceDetail: React.FC<any> = (props) => (
  <ErrorBoundary>
    <Suspense fallback={<ComponentLoader componentName="Service Details" size="lg" />}>
      <ServiceDetailLazy {...props} />
    </Suspense>
  </ErrorBoundary>
);

export const ContactForm: React.FC<any> = (props) => (
  <ErrorBoundary>
    <Suspense fallback={<ComponentLoader componentName="Contact Form" size="md" />}>
      <ContactFormLazy {...props} />
    </Suspense>
  </ErrorBoundary>
);

export const ServiceComparison: React.FC<any> = (props) => (
  <ErrorBoundary>
    <Suspense fallback={<ComponentLoader componentName="Service Comparison" size="lg" />}>
      <ServiceComparisonLazy {...props} />
    </Suspense>
  </ErrorBoundary>
);

export const ServiceRecommender: React.FC<any> = (props) => (
  <ErrorBoundary>
    <Suspense fallback={<ComponentLoader componentName="Service Recommender" size="md" />}>
      <ServiceRecommenderLazy {...props} />
    </Suspense>
  </ErrorBoundary>
);

export const ServiceBundles: React.FC<any> = (props) => (
  <ErrorBoundary>
    <Suspense fallback={<ComponentLoader componentName="Service Bundles" size="lg" />}>
      <ServiceBundlesLazy {...props} />
    </Suspense>
  </ErrorBoundary>
);

export const ServiceAssessment: React.FC<any> = (props) => (
  <ErrorBoundary>
    <Suspense fallback={<ComponentLoader componentName="Service Assessment" size="md" />}>
      <ServiceAssessmentLazy {...props} />
    </Suspense>
  </ErrorBoundary>
);

export const FAQSearch: React.FC<any> = (props) => (
  <ErrorBoundary>
    <Suspense fallback={<ComponentLoader componentName="FAQ & Support" size="md" />}>
      <FAQSearchLazy {...props} />
    </Suspense>
  </ErrorBoundary>
);

export const SocialProof: React.FC<any> = (props) => (
  <ErrorBoundary>
    <Suspense fallback={<ComponentLoader componentName="Success Stories" size="md" />}>
      <SocialProofLazy {...props} />
    </Suspense>
  </ErrorBoundary>
);

// Hook for preloading components with stable references
export const usePreloadComponents = () => {
  const preloadComponent = useCallback((componentName: string) => {
    switch (componentName) {
      case 'ServicesListing':
        import('./ServicesListing');
        break;
      case 'ServiceDetail':
        import('./ServiceDetail');
        break;
      case 'ContactForm':
        import('./ContactForm');
        break;
      case 'ServiceComparison':
        import('./ServiceComparison');
        break;
      case 'ServiceRecommender':
        import('./ServiceRecommender');
        break;
      case 'ServiceBundles':
        import('./ServiceBundles');
        break;
      case 'ServiceAssessment':
        import('./ServiceAssessment');
        break;
      case 'FAQSearch':
        import('./FAQSearch');
        break;
      case 'SocialProof':
        import('./SocialProof');
        break;
    }
  }, []);

  const preloadAllComponents = useCallback(async () => {
    const criticalComponents = [
      'ServiceDetail', 
      'ContactForm'
    ];
    
    const nonCriticalComponents = [
      'ServiceComparison',
      'ServiceRecommender',
      'ServiceBundles',
      'ServiceAssessment',
      'FAQSearch',
      'SocialProof'
    ];
    
    try {
      // Preload critical components first (faster)
      const criticalPromises = criticalComponents.map((component, index) => 
        new Promise(resolve => {
          setTimeout(() => {
            try {
              preloadComponent(component);
              resolve(component);
            } catch (error) {
              console.warn(`Failed to preload critical ${component}:`, error);
              resolve(null);
            }
          }, index * 200); // Faster stagger for critical components
        })
      );
      
      await Promise.allSettled(criticalPromises);
      
      // Preload non-critical components after a longer delay (reduced impact)
      setTimeout(() => {
        const nonCriticalPromises = nonCriticalComponents.map((component, index) => 
          new Promise(resolve => {
            setTimeout(() => {
              try {
                preloadComponent(component);
                resolve(component);
              } catch (error) {
                // Silently ignore preload failures
                resolve(null);
              }
            }, index * 1500); // Much slower stagger for non-critical
          })
        );
        
        Promise.allSettled(nonCriticalPromises);
      }, 5000); // Much longer delay for non-critical preloading
      
    } catch (error) {
      console.warn('Component preloading error:', error);
    }
  }, [preloadComponent]);

  return { preloadComponent, preloadAllComponents };
};

// Performance monitoring for lazy loading
export const LazyLoadingMetrics = {
  trackComponentLoad: (componentName: string, loadTime: number) => {
    console.log(`Component ${componentName} loaded in ${loadTime}ms`);
    
    // Send to analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'component_loaded', {
        event_category: 'Performance',
        event_label: componentName,
        value: loadTime
      });
    }
  },

  trackComponentError: (componentName: string, error: Error) => {
    console.error(`Component ${componentName} failed to load:`, error);
    
    // Send to analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'component_error', {
        event_category: 'Error',
        event_label: componentName,
        value: 1
      });
    }
  }
};