// Performance monitoring utilities - DISABLED due to critical performance issues
export class PerformanceMonitor {
  static timers = new Map();
  static metrics = new Map();
  static enabled = false; // COMPLETELY DISABLED to fix critical performance bug

  static startTimer(name) {
    // DISABLED - No-op to prevent performance issues
    return;
  }

  static endTimer(name) {
    // DISABLED - Always return 0 to prevent performance issues
    return 0;
  }

  static getMetrics() {
    // DISABLED - Return empty object
    return {};
  }

  static clearMetrics() {
    // DISABLED - No-op
    return;
  }

  // Wrap async operations with timeout - optimized
  static withTimeout(promise, timeoutMs = 8000, name = 'operation') {
    if (!promise) return Promise.resolve();
    
    return Promise.race([
      promise,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error(`${name} timed out after ${timeoutMs}ms`)), timeoutMs)
      )
    ]).catch(error => {
      console.warn(`Operation failed: ${name}`, error);
      throw error;
    });
  }

  // Disable performance monitoring for better performance
  static disable() {
    this.enabled = false;
    this.timers.clear();
    this.metrics.clear();
  }

  // Re-enable performance monitoring
  static enable() {
    this.enabled = true;
  }

  // Monitor component render times
  static measureComponent(ComponentName) {
    return (props) => {
      const startTime = performance.now();
      
      React.useEffect(() => {
        const renderTime = performance.now() - startTime;
        if (renderTime > 100) {
          console.warn(`Component ${ComponentName} took ${renderTime.toFixed(2)}ms to render`);
        }
      });

      return React.createElement(ComponentName, props);
    };
  }
}

// Debounce utility for performance optimization
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle utility for performance optimization
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Memory usage monitoring
export const monitorMemory = () => {
  if ('memory' in performance) {
    const memory = performance.memory;
    return {
      used: Math.round(memory.usedJSHeapSize / 1048576 * 100) / 100,
      total: Math.round(memory.totalJSHeapSize / 1048576 * 100) / 100,
      limit: Math.round(memory.jsHeapSizeLimit / 1048576 * 100) / 100
    };
  }
  return null;
};

// Intersection Observer for lazy loading optimization
export const createIntersectionObserver = (callback, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1
  };

  if ('IntersectionObserver' in window) {
    return new IntersectionObserver(callback, { ...defaultOptions, ...options });
  }
  
  // Fallback for browsers without IntersectionObserver
  return {
    observe: (element) => {
      // Immediately trigger callback for fallback
      callback([{ isIntersecting: true, target: element }]);
    },
    unobserve: () => {},
    disconnect: () => {}
  };
};