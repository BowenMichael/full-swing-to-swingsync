// Google Analytics 4 (GA4) Client Integration

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

export function initGoogleAnalytics(): void {
  const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (gaId && gaId.startsWith('G-')) {
    if (!window.gtag) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      window.gtag = function () {
        window.dataLayer?.push(arguments);
      };
      window.gtag('js', new Date());
      window.gtag('config', gaId, { send_page_view: true });
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
