/*declare global {
  interface Window {
    OptanonWrapper?: () => void;
    dataLayer: Record<string, unknown>[];
    Optanon?: {
      OnConsentChanged?: (callback: (event: CustomEvent) => void) => void;
    };
  }
}*/

export enum Category {
  'StrictlyNecessaryCookies' = 'C0001',
  'PerformanceCookies' = 'C0002',
  'FunctionalCookies' = 'C0003',
  'TargetingCookies' = 'C0004',
  'SocialMediaCookies' = 'C0005',
}

export interface CookieConsentSettings {
  src: string;
  domainScript: string;
  onConsentChanged?: (newConsent: Category[]) => void;
}

export const injectCookieConsentBanner = ({
  src,
  domainScript,
  onConsentChanged,
}: CookieConsentSettings) => {
  if (typeof window === 'undefined' || !window.document) return;
  const globalWindow = window as Window &
    typeof global & {
      OptanonWrapper?: () => void;
      dataLayer: Record<string, unknown>[];
      Optanon?: {
        OnConsentChanged?: (callback: (event: CustomEvent) => void) => void;
      };
    };
  return new Promise((resolve, reject) => {
    const script = window.document.createElement('script');
    script.src = src;
    script.type = 'text/javascript';
    script.dataset.domainScript = domainScript;
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    window.document.body.appendChild(script);

    const optanonFunction = window.document.createElement('script');
    optanonFunction.type = 'text/javascript';
    const code = 'function OptanonWrapper() { }';
    optanonFunction.appendChild(window.document.createTextNode(code));

    window.document.body.appendChild(optanonFunction);

    globalWindow.OptanonWrapper = () => {
      const OneTrustOnConsentChanged = globalWindow?.Optanon?.OnConsentChanged;
      if (OneTrustOnConsentChanged) {
        OneTrustOnConsentChanged((event) => {
          const activeGroups = event.detail || [];
          globalWindow.dataLayer = globalWindow.dataLayer || [];
          globalWindow.dataLayer.push({
            event: 'ConsentUpdated',
            activeGroups: activeGroups.join(','),
          });
          if (onConsentChanged) {
            onConsentChanged(activeGroups);
          }
        });
      }
    };
  });
};
