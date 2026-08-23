// Google Analytics 4 (GA4) Client Integration

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

export const GA_MEASUREMENT_ID = 'G-ZPKE8L9TR7';

export function initGoogleAnalytics(): void {
  // Ensure dataLayer & gtag are defined
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    if (!window.gtag) {
      window.gtag = function () {
        window.dataLayer?.push(arguments);
      };
    }
  }
}

export function trackEvent(eventName: string, params: Record<string, any> = {}): void {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, params);
    }
  } catch {
    // Silently ignore tracking errors
  }
}
