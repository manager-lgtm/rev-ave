import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { analyticsCache } from './utils/storage';

interface ABTest {
  testId: string;
  variant: string;
  participantId: string;
  startTime: number;
}

interface ABTestResult {
  variant: string;
  trackConversion: (data?: any) => void;
}

interface ABTestContextType {
  getTestVariant: (testId: string) => ABTestResult;
  trackConversion: (testId: string, variant: string, data?: any) => void;
}

const ABTestContext = createContext<ABTestContextType | null>(null);

// Simple memory cache to reduce localStorage reads
const testCache = new Map<string, ABTest>();

// Debug utility
const DEBUG_AB = process.env.NODE_ENV === 'development';

// A/B Test Configuration
const AB_TESTS = {
  'hero-cta-variation': {
    variants: ['control', 'urgency'],
    weights: [0.5, 0.5]
  },
  'service-detail-hero-cta': {
    variants: ['control', 'urgency', 'value'],
    weights: [0.34, 0.33, 0.33]
  },
  'service-detail-investment-cta': {
    variants: ['consultation', 'risk-free'],
    weights: [0.5, 0.5]
  },
  'exit-intent-offer': {
    variants: ['business-blueprint', 'revenue-audit', 'consultation'],
    weights: [0.34, 0.33, 0.33]
  },
  'pricing-display': {
    variants: ['control', 'value-focused'],
    weights: [0.5, 0.5]
  }
};

export function ABTestProvider({ children }: { children: React.ReactNode }) {
  const [activeTests, setActiveTests] = useState<Map<string, ABTest>>(() => {
    // Initialize from localStorage on mount
    try {
      const storedTests = localStorage.getItem('ra_ab_tests');
      if (storedTests) {
        const parsed = JSON.parse(storedTests);
        const testMap = new Map();
        Object.entries(parsed).forEach(([testId, test]) => {
          testMap.set(testId, test);
        });
        return testMap;
      }
    } catch (error) {
      console.warn('Error initializing A/B tests:', error);
    }
    return new Map();
  });

  const getTestVariant = useCallback((testId: string): ABTestResult => {
    try {
      // Check memory cache first (fastest)
      const cachedTest = testCache.get(testId);
      if (cachedTest) {
        return {
          variant: cachedTest.variant,
          trackConversion: (data) => trackConversion(testId, cachedTest.variant, data)
        };
      }

      // Check if user is already in this test (state)
      const existingTest = activeTests.get(testId);
      
      if (existingTest) {
        // Update cache
        testCache.set(testId, existingTest);
        return {
          variant: existingTest.variant,
          trackConversion: (data) => trackConversion(testId, existingTest.variant, data)
        };
      }

      // Check localStorage for existing test (fallback)
      const storedTests = localStorage.getItem('ra_ab_tests');
      if (storedTests) {
        try {
          const parsed = JSON.parse(storedTests);
          if (parsed[testId]) {
            const storedTest = parsed[testId];
            
            // Update cache
            testCache.set(testId, storedTest);
            
            // Update state asynchronously to avoid render-time state updates
            setTimeout(() => {
              setActiveTests(prev => new Map(prev).set(testId, storedTest));
            }, 0);
            
            return {
              variant: storedTest.variant,
              trackConversion: (data) => trackConversion(testId, storedTest.variant, data)
            };
          }
        } catch (parseError) {
          console.warn('Error parsing stored A/B tests:', parseError);
        }
      }

      // Assign new variant
      const testConfig = AB_TESTS[testId];
      if (!testConfig) {
        return {
          variant: 'control',
          trackConversion: () => {}
        };
      }

      const variant = selectVariant(testConfig.variants, testConfig.weights);
      const participantId = generateParticipantId();
      
      const newTest: ABTest = {
        testId,
        variant,
        participantId,
        startTime: Date.now()
      };

      // Update cache immediately
      testCache.set(testId, newTest);

      // Store in localStorage immediately (synchronous)
      try {
        const storedTests = JSON.parse(localStorage.getItem('ra_ab_tests') || '{}');
        storedTests[testId] = newTest;
        localStorage.setItem('ra_ab_tests', JSON.stringify(storedTests));
      } catch (storageError) {
        console.warn('Error storing A/B test:', storageError);
      }

      // Update state asynchronously to avoid render-time state updates
      setTimeout(() => {
        setActiveTests(prev => new Map(prev).set(testId, newTest));
      }, 0);

      if (DEBUG_AB) {
        console.log(`A/B Test: ${testId} -> ${variant}`);
      }

      return {
        variant,
        trackConversion: (data) => trackConversion(testId, variant, data)
      };
    } catch (error) {
      console.warn('A/B test error:', error);
      return {
        variant: 'control',
        trackConversion: () => {}
      };
    }
  }, [activeTests]);

  const trackConversion = useCallback((testId: string, variant: string, data: any = {}) => {
    try {
      const conversionData = {
        testId,
        variant,
        timestamp: Date.now(),
        ...data
      };

      // Store conversion in analytics cache
      analyticsCache.trackEvent('ab_test_conversion', conversionData);

      // Also track in dedicated AB test storage
      const conversions = JSON.parse(localStorage.getItem('ra_ab_conversions') || '[]');
      conversions.push(conversionData);
      
      // Keep only last 100 conversions
      if (conversions.length > 100) {
        conversions.splice(0, conversions.length - 100);
      }
      
      localStorage.setItem('ra_ab_conversions', JSON.stringify(conversions));
    } catch (error) {
      console.warn('Conversion tracking error:', error);
    }
  }, []);

  return (
    <ABTestContext.Provider value={{ getTestVariant, trackConversion }}>
      {children}
    </ABTestContext.Provider>
  );
}

export function useABTest(testId: string): ABTestResult {
  const context = useContext(ABTestContext);
  const [testResult, setTestResult] = useState<ABTestResult>(() => {
    // Initialize with control variant to prevent layout shifts
    return {
      variant: 'control',
      trackConversion: () => {}
    };
  });
  
  useEffect(() => {
    if (!context) {
      return;
    }

    // Use a flag to prevent state updates if component unmounts
    let isMounted = true;
    
    // Get test variant asynchronously to avoid render-time issues
    Promise.resolve().then(() => {
      if (isMounted) {
        const result = context.getTestVariant(testId);
        setTestResult(result);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [context, testId]);

  return testResult;
}

// A/B Test Switch Component
interface ABTestSwitchProps {
  testId: string;
  variants: Record<string, React.ReactNode>;
  fallback?: React.ReactNode;
}

export function ABTestSwitch({ testId, variants, fallback }: ABTestSwitchProps) {
  const { variant } = useABTest(testId);
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    // Mark as ready after a microtask to prevent initial flash
    Promise.resolve().then(() => setIsReady(true));
  }, []);
  
  // Show fallback until test result is ready and stable
  if (!isReady || variant === 'control') {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    // Return first variant as ultimate fallback
    const firstVariant = Object.keys(variants)[0];
    return variants[firstVariant] ? <>{variants[firstVariant]}</> : null;
  }
  
  if (variants[variant]) {
    return <>{variants[variant]}</>;
  }
  
  // Fallback if variant not found
  if (fallback) {
    return <>{fallback}</>;
  }
  
  // Return first variant as ultimate fallback
  const firstVariant = Object.keys(variants)[0];
  return variants[firstVariant] ? <>{variants[firstVariant]}</> : null;
}

// Utility functions
function selectVariant(variants: string[], weights: number[]): string {
  const random = Math.random();
  let cumulativeWeight = 0;
  
  for (let i = 0; i < variants.length; i++) {
    cumulativeWeight += weights[i];
    if (random <= cumulativeWeight) {
      return variants[i];
    }
  }
  
  return variants[0]; // Fallback
}

function generateParticipantId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// A/B Test Results Hook for Analytics
export function useABTestResults() {
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    try {
      const conversions = JSON.parse(localStorage.getItem('ra_ab_conversions') || '[]');
      const tests = JSON.parse(localStorage.getItem('ra_ab_tests') || '{}');
      
      // Aggregate results by test
      const aggregated = Object.keys(AB_TESTS).map(testId => {
        const testConversions = conversions.filter(c => c.testId === testId);
        const testParticipants = Object.values(tests).filter((t: any) => t.testId === testId);
        
        const variantResults = AB_TESTS[testId].variants.map(variant => {
          const variantConversions = testConversions.filter(c => c.variant === variant);
          const variantParticipants = testParticipants.filter((t: any) => t.variant === variant);
          
          return {
            variant,
            participants: variantParticipants.length,
            conversions: variantConversions.length,
            conversionRate: variantParticipants.length > 0 
              ? (variantConversions.length / variantParticipants.length) * 100 
              : 0
          };
        });

        return {
          testId,
          variantResults,
          totalParticipants: testParticipants.length,
          totalConversions: testConversions.length
        };
      });

      setResults(aggregated);
    } catch (error) {
      console.warn('Error loading AB test results:', error);
    }
  }, []);

  return results;
}