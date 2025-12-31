// Error tracking and monitoring with Sentry
// This is a placeholder implementation - install @sentry/react for full functionality

interface SentryConfig {
  dsn?: string;
  environment?: string;
  release?: string;
  tracesSampleRate?: number;
}

class ErrorTracker {
  private isInitialized = false;
  private isDevelopment = import.meta.env.DEV;

  init(config?: SentryConfig) {
    if (this.isInitialized) return;

    const dsn = config?.dsn || import.meta.env.VITE_SENTRY_DSN;
    
    if (!dsn) {
      if (this.isDevelopment) {
        console.log('[ErrorTracker] No Sentry DSN provided, using console logging');
      }
      this.isInitialized = true;
      return;
    }

    // In production, you would initialize Sentry here:
    // Sentry.init({
    //   dsn,
    //   environment: config?.environment || import.meta.env.MODE,
    //   release: config?.release || import.meta.env.VITE_APP_VERSION,
    //   tracesSampleRate: config?.tracesSampleRate || 0.1,
    //   integrations: [
    //     new Sentry.BrowserTracing(),
    //     new Sentry.Replay(),
    //   ],
    //   replaysSessionSampleRate: 0.1,
    //   replaysOnErrorSampleRate: 1.0,
    // });

    this.isInitialized = true;
    
    if (this.isDevelopment) {
      console.log('[ErrorTracker] Initialized (mock mode)');
    }
  }

  captureException(error: Error, context?: Record<string, any>) {
    if (this.isDevelopment) {
      console.error('[ErrorTracker] Exception:', error, context);
    }
    
    // In production with Sentry:
    // Sentry.captureException(error, { extra: context });
  }

  captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info', context?: Record<string, any>) {
    if (this.isDevelopment) {
      console.log(`[ErrorTracker] ${level.toUpperCase()}:`, message, context);
    }
    
    // In production with Sentry:
    // Sentry.captureMessage(message, { level, extra: context });
  }

  setUser(user: { id: string; email?: string; username?: string }) {
    if (this.isDevelopment) {
      console.log('[ErrorTracker] User set:', user);
    }
    
    // In production with Sentry:
    // Sentry.setUser(user);
  }

  clearUser() {
    if (this.isDevelopment) {
      console.log('[ErrorTracker] User cleared');
    }
    
    // In production with Sentry:
    // Sentry.setUser(null);
  }

  addBreadcrumb(breadcrumb: { message: string; category?: string; level?: string; data?: Record<string, any> }) {
    if (this.isDevelopment) {
      console.log('[ErrorTracker] Breadcrumb:', breadcrumb);
    }
    
    // In production with Sentry:
    // Sentry.addBreadcrumb(breadcrumb);
  }

  setContext(name: string, context: Record<string, any>) {
    if (this.isDevelopment) {
      console.log(`[ErrorTracker] Context [${name}]:`, context);
    }
    
    // In production with Sentry:
    // Sentry.setContext(name, context);
  }
}

// Export singleton
export const errorTracker = new ErrorTracker();

// Auto-initialize
if (typeof window !== 'undefined') {
  errorTracker.init();

  // Global error handler
  window.addEventListener('error', (event) => {
    errorTracker.captureException(event.error, {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  });

  // Unhandled promise rejection handler
  window.addEventListener('unhandledrejection', (event) => {
    errorTracker.captureException(
      event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
      { type: 'unhandledrejection' }
    );
  });
}

// Installation instructions:
// 1. Install Sentry: pnpm add @sentry/react
// 2. Add VITE_SENTRY_DSN to .env
// 3. Uncomment Sentry initialization code above
// 4. Wrap your app with Sentry.ErrorBoundary in main.tsx
