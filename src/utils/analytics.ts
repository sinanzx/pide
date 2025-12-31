// Analytics utility for tracking user interactions and page views
// Supports multiple analytics providers (Google Analytics, Plausible, etc.)

interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
}

interface PageViewData {
  path: string;
  title: string;
  referrer?: string;
}

class Analytics {
  private isInitialized = false;
  private isDevelopment = import.meta.env.DEV;

  // Initialize analytics providers
  init() {
    if (this.isInitialized) return;
    
    // Google Analytics 4 (if GA_MEASUREMENT_ID is set)
    const gaMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    if (gaMeasurementId && typeof window !== 'undefined') {
      this.initGoogleAnalytics(gaMeasurementId);
    }

    // Plausible Analytics (privacy-friendly alternative)
    const plausibleDomain = import.meta.env.VITE_PLAUSIBLE_DOMAIN;
    if (plausibleDomain && typeof window !== 'undefined') {
      this.initPlausible(plausibleDomain);
    }

    this.isInitialized = true;
    
    if (this.isDevelopment) {
      console.log('[Analytics] Initialized in development mode');
    }
  }

  // Google Analytics 4 initialization
  private initGoogleAnalytics(measurementId: string) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(...args: any[]) {
      (window as any).dataLayer.push(args);
    }
    (window as any).gtag = gtag;

    gtag('js', new Date());
    gtag('config', measurementId, {
      send_page_view: false, // We'll handle page views manually
    });
  }

  // Plausible Analytics initialization
  private initPlausible(domain: string) {
    const script = document.createElement('script');
    script.defer = true;
    script.setAttribute('data-domain', domain);
    script.src = 'https://plausible.io/js/script.js';
    document.head.appendChild(script);
  }

  // Track page view
  pageView(data: PageViewData) {
    if (this.isDevelopment) {
      console.log('[Analytics] Page View:', {
        path: data.path,
        title: data.title,
        referrer: data.referrer || 'direct'
      });
      return;
    }

    // Google Analytics
    if (typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', 'page_view', {
        page_path: data.path,
        page_title: data.title,
        page_referrer: data.referrer,
      });
    }

    // Plausible (automatically tracks page views)
    if (typeof (window as any).plausible === 'function') {
      (window as any).plausible('pageview');
    }
  }

  // Track custom event
  event(event: AnalyticsEvent) {
    if (this.isDevelopment) {
      console.log('[Analytics] Event:', {
        category: event.category,
        action: event.action,
        label: event.label,
        value: event.value
      });
      return;
    }

    // Google Analytics
    if (typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
      });
    }

    // Plausible custom events
    if (typeof (window as any).plausible === 'function') {
      (window as any).plausible(event.action, {
        props: {
          category: event.category,
          label: event.label,
          value: event.value,
        },
      });
    }
  }

  // Convenience methods for common events
  trackButtonClick(buttonName: string, location: string) {
    this.event({
      category: 'Button',
      action: 'click',
      label: `${buttonName} - ${location}`,
    });
  }

  trackLinkClick(linkName: string, url: string) {
    this.event({
      category: 'Link',
      action: 'click',
      label: `${linkName} - ${url}`,
    });
  }

  trackFeatureInteraction(featureName: string, action: string) {
    this.event({
      category: 'Feature',
      action,
      label: featureName,
    });
  }

  trackError(errorMessage: string, errorLocation: string) {
    this.event({
      category: 'Error',
      action: 'exception',
      label: `${errorLocation}: ${errorMessage}`,
    });
  }

  trackPerformance(metricName: string, value: number) {
    this.event({
      category: 'Performance',
      action: 'timing',
      label: metricName,
      value: Math.round(value),
    });
  }
}

// Export singleton instance
export const analytics = new Analytics();

// Auto-initialize on import
if (typeof window !== 'undefined') {
  analytics.init();
}
