// Performance monitoring utilities
import { analytics } from './analytics';

interface PerformanceMetrics {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {};
  private observer: PerformanceObserver | null = null;

  init() {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    // Observe Web Vitals
    this.observeWebVitals();
    
    // Report on page load
    if (document.readyState === 'complete') {
      this.reportMetrics();
    } else {
      window.addEventListener('load', () => this.reportMetrics());
    }
  }

  private observeWebVitals() {
    try {
      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        this.metrics.lcp = lastEntry.renderTime || lastEntry.loadTime;
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.metrics.fid = entry.processingStart - entry.startTime;
        });
      });
      fidObserver.observe({ type: 'first-input', buffered: true });

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as any[]) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            this.metrics.cls = clsValue;
          }
        }
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });

      this.observer = lcpObserver;
    } catch (error) {
      console.error('[Performance] Failed to observe web vitals:', error);
    }
  }

  private reportMetrics() {
    // Get navigation timing
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (navigation) {
      this.metrics.ttfb = navigation.responseStart - navigation.requestStart;
      this.metrics.fcp = navigation.domContentLoadedEventEnd - navigation.fetchStart;
    }

    // Report to analytics
    if (this.metrics.lcp) {
      analytics.trackPerformance('LCP', this.metrics.lcp);
    }
    if (this.metrics.fid) {
      analytics.trackPerformance('FID', this.metrics.fid);
    }
    if (this.metrics.cls) {
      analytics.trackPerformance('CLS', this.metrics.cls * 1000); // Convert to ms
    }
    if (this.metrics.ttfb) {
      analytics.trackPerformance('TTFB', this.metrics.ttfb);
    }
    if (this.metrics.fcp) {
      analytics.trackPerformance('FCP', this.metrics.fcp);
    }

    // Log in development
    if (import.meta.env.DEV) {
      console.log('[Performance] Web Vitals:', {
        LCP: this.metrics.lcp ? `${Math.round(this.metrics.lcp)}ms` : 'N/A',
        FID: this.metrics.fid ? `${Math.round(this.metrics.fid)}ms` : 'N/A',
        CLS: this.metrics.cls ? this.metrics.cls.toFixed(3) : 'N/A',
        TTFB: this.metrics.ttfb ? `${Math.round(this.metrics.ttfb)}ms` : 'N/A',
        FCP: this.metrics.fcp ? `${Math.round(this.metrics.fcp)}ms` : 'N/A',
      });
    }
  }

  // Get current metrics
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  // Cleanup
  disconnect() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// Export singleton
export const performanceMonitor = new PerformanceMonitor();

// Auto-initialize
if (typeof window !== 'undefined') {
  performanceMonitor.init();
}

// Utility to measure custom operations
export function measureOperation<T>(
  name: string,
  operation: () => T | Promise<T>
): T | Promise<T> {
  const start = performance.now();
  
  try {
    const result = operation();
    
    if (result instanceof Promise) {
      return result.finally(() => {
        const duration = performance.now() - start;
        analytics.trackPerformance(name, duration);
      }) as T;
    } else {
      const duration = performance.now() - start;
      analytics.trackPerformance(name, duration);
      return result;
    }
  } catch (error) {
    const duration = performance.now() - start;
    analytics.trackPerformance(`${name}_error`, duration);
    throw error;
  }
}
