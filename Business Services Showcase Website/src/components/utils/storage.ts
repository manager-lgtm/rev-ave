// Enhanced localStorage utility with error handling and data validation

interface CacheConfig {
  expiry?: number; // milliseconds
  version?: string;
}

interface CachedData<T> {
  data: T;
  timestamp: number;
  version: string;
  expiry?: number;
}

class StorageManager {
  private prefix = 'ra_'; // Revenue Avenue prefix
  private defaultVersion = '1.0.0';

  // Check if localStorage is available
  private isAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  // Set item with optional expiry and versioning
  set<T>(key: string, value: T, config: CacheConfig = {}): boolean {
    if (!this.isAvailable()) return false;

    try {
      const cachedData: CachedData<T> = {
        data: value,
        timestamp: Date.now(),
        version: config.version || this.defaultVersion,
        expiry: config.expiry
      };

      localStorage.setItem(this.prefix + key, JSON.stringify(cachedData));
      return true;
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
      return false;
    }
  }

  // Get item with automatic expiry check
  get<T>(key: string, expectedVersion?: string): T | null {
    if (!this.isAvailable()) return null;

    try {
      const item = localStorage.getItem(this.prefix + key);
      if (!item) return null;

      const cachedData: CachedData<T> = JSON.parse(item);

      // Check version compatibility
      if (expectedVersion && cachedData.version !== expectedVersion) {
        this.remove(key);
        return null;
      }

      // Check expiry
      if (cachedData.expiry && Date.now() - cachedData.timestamp > cachedData.expiry) {
        this.remove(key);
        return null;
      }

      return cachedData.data;
    } catch (error) {
      console.warn('Failed to retrieve from localStorage:', error);
      this.remove(key);
      return null;
    }
  }

  // Remove specific item
  remove(key: string): boolean {
    if (!this.isAvailable()) return false;

    try {
      localStorage.removeItem(this.prefix + key);
      return true;
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error);
      return false;
    }
  }

  // Clear all Revenue Avenue data
  clear(): boolean {
    if (!this.isAvailable()) return false;

    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
      return false;
    }
  }

  // Get all keys with our prefix
  getKeys(): string[] {
    if (!this.isAvailable()) return [];

    try {
      return Object.keys(localStorage)
        .filter(key => key.startsWith(this.prefix))
        .map(key => key.substring(this.prefix.length));
    } catch {
      return [];
    }
  }

  // Get storage usage info
  getStorageInfo(): { used: number; available: boolean; keys: number } {
    return {
      used: this.isAvailable() ? JSON.stringify(localStorage).length : 0,
      available: this.isAvailable(),
      keys: this.getKeys().length
    };
  }
}

// Create singleton instance
export const storage = new StorageManager();

// Specific cache utilities for Revenue Avenue

// Form data persistence
export const formCache = {
  save: (formId: string, data: Record<string, any>) => {
    return storage.set(`form_${formId}`, data, { 
      expiry: 30 * 60 * 1000 // 30 minutes
    });
  },

  load: (formId: string) => {
    return storage.get<Record<string, any>>(`form_${formId}`);
  },

  clear: (formId: string) => {
    return storage.remove(`form_${formId}`);
  }
};

// User preferences
export const userPreferences = {
  save: (prefs: {
    theme?: 'light' | 'dark';
    comparisonServices?: string[];
    lastRecommendation?: any;
    favoriteServices?: string[];
    visitCount?: number;
    lastVisit?: number;
  }) => {
    return storage.set('user_preferences', prefs);
  },

  load: () => {
    return storage.get<{
      theme?: 'light' | 'dark';
      comparisonServices?: string[];
      lastRecommendation?: any;
      favoriteServices?: string[];
      visitCount?: number;
      lastVisit?: number;
    }>('user_preferences') || {};
  },

  update: (partialPrefs: Partial<{
    theme?: 'light' | 'dark';
    comparisonServices?: string[];
    lastRecommendation?: any;
    favoriteServices?: string[];
    visitCount?: number;
    lastVisit?: number;
  }>) => {
    const current = userPreferences.load();
    return userPreferences.save({ ...current, ...partialPrefs });
  }
};

// Analytics cache for visitor tracking
export const analyticsCache = {
  trackVisit: () => {
    const prefs = userPreferences.load();
    const visitCount = (prefs.visitCount || 0) + 1;
    userPreferences.update({ 
      visitCount, 
      lastVisit: Date.now() 
    });
    return visitCount;
  },

  getVisitCount: () => {
    return userPreferences.load().visitCount || 0;
  },

  isReturningUser: () => {
    return analyticsCache.getVisitCount() > 1;
  },

  trackEvent: (eventName: string, data: any = {}) => {
    try {
      const events = storage.get<any[]>('analytics_events') || [];
      const event = {
        name: eventName,
        data,
        timestamp: Date.now(),
        sessionId: storage.get<string>('session_id') || 'unknown'
      };
      
      events.push(event);
      
      // Keep only last 50 events
      if (events.length > 50) {
        events.splice(0, events.length - 50);
      }
      
      storage.set('analytics_events', events);
      return true;
    } catch (error) {
      console.warn('Analytics tracking error:', error);
      return false;
    }
  },

  getEvents: () => {
    return storage.get<any[]>('analytics_events') || [];
  }
};

// Recently viewed services
export const recentlyViewed = {
  add: (serviceId: string) => {
    const recent = storage.get<string[]>('recently_viewed') || [];
    const updated = [serviceId, ...recent.filter(id => id !== serviceId)].slice(0, 5);
    return storage.set('recently_viewed', updated);
  },

  get: () => {
    return storage.get<string[]>('recently_viewed') || [];
  },

  clear: () => {
    return storage.remove('recently_viewed');
  }
};