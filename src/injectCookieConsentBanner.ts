declare global {
  interface Window {
    OptanonWrapper?: () => void;
    dataLayer: Record<string, unknown>[];
    Optanon?: {
      OnConsentChanged?: (callback: (event: CustomEvent) => void) => void;
      Init?: (callback: (event: CustomEvent) => void) => void;
    };
  }
}

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
  onConsentChanged: (newConsent: Category[]) => void;
  // TODO: I thought this might be useful to disable OneTrust on dev env?
  enabled: boolean;
}

// TODO: Make parsing reliable or maybe there is a lib for it
// TODO: Check if window.OnetrustActiveGroups can be used and no cookie parsing would be needed
/*function parseConsentCookie(
  onConsentChanged: (newConsent: Category[]) => void
) {
  const currentConsent = Cookie.get('OptanonConsent');
  if (currentConsent) {
    const groups = currentConsent
      .split('&')
      .filter((val) => val.startsWith('groups'))[0]
      .replace('groups=', '');
    const activeGroups =
      groups
        .split(',')
        .map((val) => {
          const [group, value] = val.split(':');
          if (value === '1') return group;
          return null;
        })
        .filter(Boolean) || [];
    onConsentChanged(activeGroups as Category[]);
  }
}*/

function renderOneTrustScript(
  src: string,
  domainScript: string,
  resolve: (value?: PromiseLike<unknown> | unknown) => void,
  reject: (reason?: unknown) => void
) {
  // TODO: FYI, I used vanilla JS so that it's sharable independent of the framework in a pkg
  const script = global.document.createElement('script');
  script.src = src;
  script.type = 'text/javascript';
  script.dataset.domainScript = domainScript;
  script.async = true;
  script.onload = resolve;
  script.onerror = reject;
  global.document.body.appendChild(script);
}

function renderOptanonWrapper() {
  const wrapper = global.document.createElement('script');
  wrapper.type = 'text/javascript';
  const code = 'function OptanonWrapper() { }';
  wrapper.appendChild(global.document.createTextNode(code));

  global.document.body.appendChild(wrapper);
}

function renderPreloadLink(src: string) {
  const preloadLink = global.document.createElement('link');
  preloadLink.rel = 'preload';
  preloadLink.href = src;
  preloadLink.as = 'script';
  global.document.head.appendChild(preloadLink);
}

// TODO: extract logic to pkg to share it between the new and old projects
// https://github.com/smg-automotive/cookie-consent-pkg
export const injectCookieConsentBanner = async ({
  src,
  domainScript,
  onConsentChanged,
  enabled = true,
}: CookieConsentSettings) => {
  if (!global.document || !global.window) return;

  if (!enabled) {
    onConsentChanged([Category.StrictlyNecessaryCookies]);
    return;
  }

  // TODO: this would be useful to to on the server
  //  so that we can exclude certain scripts server side already
  //parseConsentCookie(onConsentChanged);

  return new Promise((resolve, reject) => {
    renderPreloadLink(src);
    renderOneTrustScript(src, domainScript, resolve, reject);
    renderOptanonWrapper();

    global.window.OptanonWrapper = () => {
      const OneTrustOnConsentChanged = global.window?.Optanon?.OnConsentChanged;
      if (OneTrustOnConsentChanged) {
        OneTrustOnConsentChanged((event) => {
          const activeGroups = event.detail || [];
          // TODO: Check with Pascal Weill if he needs that
          // (OneTrust already creates an own event in dataLayer)
          global.window.dataLayer.push({
            event: 'ConsentUpdated',
            activeGroups: activeGroups.join(','),
          });
          // TODO: Discuss with backend if we could store the consent
          //  for logged in users in the backend.
          //  It might help us for performance optimizations in the future
          //  to know this already on the backend
          onConsentChanged(activeGroups);
        });
      }
    };
  });
};
