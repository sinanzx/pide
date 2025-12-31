// PWA utilities for service worker registration and install prompt

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

class PWAManager {
  private deferredPrompt: BeforeInstallPromptEvent | null = null;
  private isInstalled = false;

  init() {
    if (typeof window === 'undefined') return;

    // Register service worker
    this.registerServiceWorker();

    // Listen for install prompt
    this.setupInstallPrompt();

    // Check if already installed
    this.checkInstallStatus();
  }

  private async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });

        if (import.meta.env.DEV) {
          console.log('[PWA] Service Worker registered:', registration.scope);
        }

        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker available
                if (import.meta.env.DEV) {
                  console.log('[PWA] New service worker available');
                }
                // Optionally notify user about update
                this.notifyUpdate();
              }
            });
          }
        });
      } catch (error) {
        console.error('[PWA] Service Worker registration failed:', error);
      }
    }
  }

  private setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e as BeforeInstallPromptEvent;
      
      if (import.meta.env.DEV) {
        console.log('[PWA] Install prompt available');
      }
    });

    window.addEventListener('appinstalled', () => {
      this.isInstalled = true;
      this.deferredPrompt = null;
      
      if (import.meta.env.DEV) {
        console.log('[PWA] App installed');
      }
    });
  }

  private checkInstallStatus() {
    // Check if running as PWA
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isIOSStandalone = (window.navigator as any).standalone === true;

    this.isInstalled = isStandalone || (isIOS && isIOSStandalone);

    if (import.meta.env.DEV && this.isInstalled) {
      console.log('[PWA] Running as installed app');
    }
  }

  private notifyUpdate() {
    // Dispatch custom event for UI to handle
    window.dispatchEvent(new CustomEvent('pwa-update-available'));
  }

  // Public API
  async showInstallPrompt(): Promise<boolean> {
    if (!this.deferredPrompt) {
      return false;
    }

    try {
      await this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      
      if (import.meta.env.DEV) {
        console.log('[PWA] Install prompt outcome:', outcome);
      }

      this.deferredPrompt = null;
      return outcome === 'accepted';
    } catch (error) {
      console.error('[PWA] Install prompt failed:', error);
      return false;
    }
  }

  canInstall(): boolean {
    return this.deferredPrompt !== null && !this.isInstalled;
  }

  isAppInstalled(): boolean {
    return this.isInstalled;
  }

  async updateServiceWorker() {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration && registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
      }
    }
  }
}

// Export singleton
export const pwaManager = new PWAManager();

// Auto-initialize
if (typeof window !== 'undefined') {
  pwaManager.init();
}
