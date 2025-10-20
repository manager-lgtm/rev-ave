// No-operation performance monitor to replace the problematic one
export const PerformanceMonitor = {
  startTimer: () => {},
  endTimer: () => 0,
  getMetrics: () => ({}),
  clearMetrics: () => {},
  disable: () => {},
  enable: () => {},
  withTimeout: (promise) => promise || Promise.resolve(),
  measureComponent: (Component) => Component
};

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

export const monitorMemory = () => null;

export const createIntersectionObserver = (callback, options = {}) => {
  if ('IntersectionObserver' in window) {
    return new IntersectionObserver(callback, options);
  }
  
  return {
    observe: () => {},
    unobserve: () => {},
    disconnect: () => {}
  };
};