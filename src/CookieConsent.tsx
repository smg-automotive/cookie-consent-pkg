import * as React from 'react';

import { Category } from './category';

declare global {
  interface Window {
    OptanonWrapper?: () => void;
    Optanon?: {
      OnConsentChanged?: (callback: (event: CustomEvent) => void) => void;
    };
    OneTrust: {
      ToggleInfoDisplay: () => void;
    };
    OnetrustActiveGroups: string;
  }
}

type Context = {
  consent: Category[];
  isLoaded: boolean;
  hasInteracted: boolean;
  openPreferenceCenter: () => void;
};

const CookieConsentContext = React.createContext<Context>({
  consent: [],
  isLoaded: false,
  hasInteracted: false,
  openPreferenceCenter: () => null,
});

type Props = {
  enabled: boolean;
  onConsentChanged?: (newConsent: Category[]) => void;
  onOneTrustLoaded?: (consent: Category[], hideBanner: boolean) => void;
};

type OneTrust = {
  consent: Category[];
  isLoaded: boolean;
  hasInteracted: boolean;
};

const CookieConsentProvider: React.FC<React.PropsWithChildren<Props>> = ({
  enabled,
  onConsentChanged,
  onOneTrustLoaded,
  children,
}) => {
  const [oneTrust, setOneTrust] = React.useState<OneTrust>({
    consent: [Category.StrictlyNecessaryCookies],
    isLoaded: false,
    hasInteracted: false,
  });

  const setInitialConsent = React.useCallback(() => {
    // eslint-disable-next-line no-console
    console.log('setting initial consent');
    setOneTrust((prevOneTrust) => {
      // eslint-disable-next-line no-console
      console.log({ prevOneTrust });
      if (prevOneTrust.isLoaded) return prevOneTrust;

      const oneTrustActiveGroups = (
        window.OnetrustActiveGroups?.split(',') as Category[]
      )?.filter(Boolean);
      const initialConsent =
        oneTrustActiveGroups && oneTrustActiveGroups.length
          ? oneTrustActiveGroups
          : prevOneTrust.consent;
      const hideBanner = document.cookie.includes('OptanonAlertBoxClosed');
      onOneTrustLoaded && onOneTrustLoaded(initialConsent, hideBanner);

      // eslint-disable-next-line no-console
      console.log({
        consent: initialConsent,
        isLoaded: true,
        hasInteracted: hideBanner,
      });
      return {
        consent: initialConsent,
        isLoaded: true,
        hasInteracted: hideBanner,
      };
    });
  }, [onOneTrustLoaded]);

  const optanonWrapper = React.useCallback(() => {
    // eslint-disable-next-line no-console
    console.log('optanonWrapper called');
    setInitialConsent();
    const OneTrustOnConsentChanged = window?.Optanon?.OnConsentChanged;
    if (OneTrustOnConsentChanged) {
      OneTrustOnConsentChanged((event) => {
        const activeGroups = event.detail || [];
        onConsentChanged && onConsentChanged(activeGroups);
        setOneTrust({
          consent: activeGroups,
          isLoaded: true,
          hasInteracted: true,
        });
      });
    }
  }, [onConsentChanged, setInitialConsent]);

  React.useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('effect runs', enabled);
    if (!enabled) return;
    window.OptanonWrapper = optanonWrapper;
  }, [enabled, optanonWrapper]);

  const openPreferenceCenter = () => {
    window.OneTrust?.ToggleInfoDisplay();
  };

  return (
    <CookieConsentContext.Provider
      value={{
        consent: oneTrust.consent,
        openPreferenceCenter,
        isLoaded: oneTrust.isLoaded,
        hasInteracted: oneTrust.hasInteracted,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
};

const useCookieConsent = () => {
  const context = React.useContext(CookieConsentContext);
  if (context === undefined) {
    throw new Error(
      'useCookieConsent must be used within a CookieConsentProvider',
    );
  }
  return context;
};

export { CookieConsentProvider, CookieConsentContext, useCookieConsent };
