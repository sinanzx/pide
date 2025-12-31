import { lazy, Suspense } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import { usePageTracking } from './hooks/usePageTracking';

// Lazy load pages for code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const MarketingSite = lazy(() => import('./pages/MarketingSite'));
const Index = lazy(() => import('./pages/Index'));
const Placeholder = lazy(() => import('./pages/Placeholder'));

// Lightweight Loading State (No heavy imports)
const LoadingScreen = () => (
  <div style={{height: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', fontFamily: 'monospace', fontSize: '12px', letterSpacing: '0.2em'}}>
    INITIALIZING...
  </div>
);

// Analytics wrapper component
const AnalyticsWrapper = ({ children }: { children: React.ReactNode }) => {
  usePageTracking();
  return <>{children}</>;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ToastProvider>
        <Toaster />
        <div className="dark">
          <BrowserRouter>
            <AnalyticsWrapper>
              <Suspense fallback={<LoadingScreen />}>
                <Routes>
                  <Route path="/" element={<MarketingSite />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="*" element={<Placeholder />} />
                </Routes>
              </Suspense>
            </AnalyticsWrapper>
          </BrowserRouter>
        </div>
      </ToastProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
