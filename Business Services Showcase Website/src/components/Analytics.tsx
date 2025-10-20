import React, { useEffect, useCallback } from 'react';
import { storage, userPreferences, analyticsCache } from './utils/storage';

// Analytics Event Types
export type AnalyticsEvent = 
  | 'page_view'
  | 'service_view'
  | 'service_select'
  | 'booking_initiated'
  | 'booking_completed'
  | 'comparison_started'
  | 'comparison_completed'
  | 'recommender_started'
  | 'recommender_completed'
  | 'exit_intent_shown'
  | 'exit_intent_converted'
  | 'bundle_viewed'
  | 'calculator_used'
  | 'faq_searched'
  | 'social_proof_viewed'
  | 'form_abandoned'
  | 'scroll_depth'
  | 'time_on_page'
  | 'click_cta'
  | 'search_performed'
  | 'download_resource';

interface AnalyticsEventData {
  event: AnalyticsEvent;
  properties?: Record<string, any>;
  timestamp?: number;
  sessionId?: string;
  userId?: string;
  pageUrl?: string;
  referrer?: string;
  userAgent?: string;
  viewport?: { width: number; height: number };
  device?: 'mobile' | 'tablet' | 'desktop';
}

class AnalyticsManager {
  private sessionId: string;
  private userId: string;
  private queue: AnalyticsEventData[] = [];
  private isOnline: boolean = navigator.onLine;
  private startTime: number = Date.now();
  private lastScrollDepth: number = 0;
  private maxScrollDepth: number = 0;
  private isInitialized: boolean = false;

  constructor() {
    if (this.isInitialized) return; // Prevent multiple initialization
    
    this.sessionId = this.generateSessionId();
    this.userId = this.getUserId();
    this.setupEventListeners();
    this.trackPageLoad();
    this.isInitialized = true;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getUserId(): string {
    let userId = storage.get<string>('user_id');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      storage.set('user_id', userId);
    }
    return userId;
  }

  private getDevice(): 'mobile' | 'tablet' | 'desktop' {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  private setupEventListeners(): void {
    // Online/Offline status
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.flushQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });

    // Page visibility (time tracking)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.trackTimeOnPage();
      }
    });

    // Scroll depth tracking
    let scrollTimeout: NodeJS.Timeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.trackScrollDepth();
      }, 100);
    });

    // Before unload (track session end)
    window.addEventListener('beforeunload', () => {
      this.trackTimeOnPage();
      this.flushQueue();
    });

    // Click tracking for CTAs
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.closest('[data-analytics-cta]')) {
        const ctaName = target.closest('[data-analytics-cta]')?.getAttribute('data-analytics-cta');
        this.track('click_cta', { cta_name: ctaName, element: target.tagName });
      }
    });
  }

  private trackPageLoad(): void {
    this.track('page_view', {
      load_time: Date.now() - this.startTime,
      referrer: document.referrer,
      landing_page: window.location.pathname,
      utm_source: this.getUrlParam('utm_source'),
      utm_medium: this.getUrlParam('utm_medium'),
      utm_campaign: this.getUrlParam('utm_campaign'),
    });
  }

  private trackScrollDepth(): void {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.round((scrollTop / docHeight) * 100);

    this.maxScrollDepth = Math.max(this.maxScrollDepth, scrollPercent);

    // Track milestones: 25%, 50%, 75%, 90%
    const milestones = [25, 50, 75, 90];
    milestones.forEach(milestone => {
      if (scrollPercent >= milestone && this.lastScrollDepth < milestone) {
        this.track('scroll_depth', { 
          depth_percent: milestone,
          page: window.location.pathname 
        });
      }
    });

    this.lastScrollDepth = scrollPercent;
  }

  private trackTimeOnPage(): void {
    const timeOnPage = Date.now() - this.startTime;
    this.track('time_on_page', {
      duration_ms: timeOnPage,
      duration_seconds: Math.round(timeOnPage / 1000),
      page: window.location.pathname,
      max_scroll_depth: this.maxScrollDepth
    });
  }

  private getUrlParam(param: string): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  // Public API
  public track(event: AnalyticsEvent, properties: Record<string, any> = {}): void {
    const eventData: AnalyticsEventData = {
      event,
      properties: {
        ...properties,
        visit_count: analyticsCache.getVisitCount(),
        is_returning_user: analyticsCache.isReturningUser(),
        session_duration: Date.now() - this.startTime,
      },
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId,
      pageUrl: window.location.href,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      device: this.getDevice()
    };

    this.queue.push(eventData);

    // Store locally for offline analysis
    this.storeEventLocally(eventData);

    // Send to external services if online
    if (this.isOnline) {
      this.flushQueue();
    }
  }

  public trackConversion(conversionType: string, value?: number, currency: string = 'USD'): void {
    this.track('booking_completed', {
      conversion_type: conversionType,
      conversion_value: value,
      currency,
      funnel_stage: 'conversion',
      time_to_convert: Date.now() - this.startTime
    });
  }

  public trackFormEvent(formId: string, eventType: 'start' | 'progress' | 'complete' | 'abandon', data?: Record<string, any>): void {
    this.track(eventType === 'abandon' ? 'form_abandoned' : 'booking_initiated', {
      form_id: formId,
      form_event: eventType,
      ...data
    });
  }

  public trackSearch(query: string, results?: number, category?: string): void {
    this.track('search_performed', {
      search_query: query,
      results_count: results,
      search_category: category
    });
  }

  private storeEventLocally(eventData: AnalyticsEventData): void {
    try {
      const events = storage.get<AnalyticsEventData[]>('analytics_events') || [];
      events.push(eventData);
      
      // Keep only last 1000 events to prevent storage overflow
      const trimmedEvents = events.slice(-1000);
      storage.set('analytics_events', trimmedEvents, { expiry: 7 * 24 * 60 * 60 * 1000 }); // 7 days
    } catch (error) {
      console.warn('Failed to store analytics event locally:', error);
    }
  }

  private async flushQueue(): Promise<void> {
    if (this.queue.length === 0) return;

    const events = [...this.queue];
    this.queue = [];

    try {
      // In production, send to your analytics service
      // Examples: Google Analytics 4, Mixpanel, Amplitude, etc.
      
      // Google Analytics 4 example:
      if (typeof gtag !== 'undefined') {
        events.forEach(event => {
          gtag('event', event.event, {
            custom_parameter_1: JSON.stringify(event.properties),
            session_id: event.sessionId,
            user_id: event.userId
          });
        });
      }

      // Custom analytics endpoint example:
      // await fetch('/api/analytics', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ events })
      // });

      console.log('Analytics events sent:', events);
      
    } catch (error) {
      console.error('Failed to send analytics events:', error);
      // Re-queue events for retry
      this.queue.unshift(...events);
    }
  }

  // Analytics insights
  public getSessionInsights(): {
    sessionDuration: number;
    eventsCount: number;
    maxScrollDepth: number;
    device: string;
    isReturningUser: boolean;
  } {
    const events = storage.get<AnalyticsEventData[]>('analytics_events') || [];
    const sessionEvents = events.filter(e => e.sessionId === this.sessionId);

    return {
      sessionDuration: Date.now() - this.startTime,
      eventsCount: sessionEvents.length,
      maxScrollDepth: this.maxScrollDepth,
      device: this.getDevice(),
      isReturningUser: analyticsCache.isReturningUser()
    };
  }

  public getUserInsights(): {
    totalSessions: number;
    totalEvents: number;
    lastVisit: number;
    favoriteServices: string[];
    conversionEvents: number;
  } {
    const events = storage.get<AnalyticsEventData[]>('analytics_events') || [];
    const userEvents = events.filter(e => e.userId === this.userId);
    const sessions = new Set(userEvents.map(e => e.sessionId)).size;
    const conversions = userEvents.filter(e => e.event === 'booking_completed').length;
    const prefs = userPreferences.load();

    return {
      totalSessions: sessions,
      totalEvents: userEvents.length,
      lastVisit: prefs.lastVisit || Date.now(),
      favoriteServices: prefs.favoriteServices || [],
      conversionEvents: conversions
    };
  }
}

// Singleton instance
export const analytics = new AnalyticsManager();

// React Hook for analytics with stable references
export const useAnalytics = () => {
  // Create stable references that don't change between renders
  const trackEvent = useCallback((event: AnalyticsEvent, properties?: Record<string, any>) => {
    analytics.track(event, properties);
  }, []);

  const trackPageView = useCallback((pageName: string, properties?: Record<string, any>) => {
    analytics.track('page_view', { page_name: pageName, ...properties });
  }, []);

  const trackConversion = useCallback((type: string, value?: number) => {
    analytics.trackConversion(type, value);
  }, []);

  const trackFormEvent = useCallback((formId: string, eventType: 'start' | 'progress' | 'complete' | 'abandon', data?: Record<string, any>) => {
    analytics.trackFormEvent(formId, eventType, data);
  }, []);

  // Memoize the insights functions to prevent recreating them
  const getInsights = useCallback(() => analytics.getSessionInsights(), []);
  const getUserInsights = useCallback(() => analytics.getUserInsights(), []);

  return {
    trackEvent,
    trackPageView,
    trackConversion,
    trackFormEvent,
    getInsights,
    getUserInsights
  };
};

// Analytics Provider Component
export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = React.useState(false);

  useEffect(() => {
    if (!isInitialized) {
      // Initialize analytics on mount - only once
      console.log('Analytics initialized with session:', analytics.getSessionInsights());
      setIsInitialized(true);
    }
  }, [isInitialized]);

  return <>{children}</>;
};