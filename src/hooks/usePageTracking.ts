import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from '@/utils/analytics';

/**
 * Hook to automatically track page views on route changes
 */
export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    // Track page view on route change
    analytics.pageView({
      path: location.pathname + location.search,
      title: document.title,
      referrer: document.referrer,
    });
  }, [location]);
}
