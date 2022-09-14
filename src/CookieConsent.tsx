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
  openPreferenceCenter: () => void;
};

const CookieConsentContext = React.createContext<Context>({
  consent: [],
  isLoaded: false,
  openPreferenceCenter: () => null,
});

type Props = {
  enabled: boolean;
  onConsentChanged?: (newConsent: Category[]) => void;
  onOneTrustLoaded?: (consent: Category[], showBanner: boolean) => void;
};

type OneTrust = {
  consent: Category[];
  isLoaded: boolean;
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
  });

  const getCookie = (name: string) => {
    const value = '; ' + document.cookie;
    /* eslint-disable-next-line no-console */
    console.log(value);
    const parts = value.split('; ' + name + '=');
    /* eslint-disable-next-line no-console */
    console.log(parts);
    if (parts && parts.length == 2) {
      return parts.pop()?.split(';').shift();
    } else {
      return null;
    }
  };

  const setInitialConsent = React.useCallback(() => {
    setOneTrust((prevOneTrust) => {
      if (prevOneTrust.isLoaded) return prevOneTrust;

      const oneTrustActiveGroups = (
        window.OnetrustActiveGroups?.split(',') as Category[]
      )?.filter(Boolean);
      const initialConsent =
        oneTrustActiveGroups && oneTrustActiveGroups.length
          ? oneTrustActiveGroups
          : prevOneTrust.consent;
      const showBanner = !!getCookie('OptanonAlertBoxClosed');
      onOneTrustLoaded && onOneTrustLoaded(initialConsent, showBanner);
      return {
        consent: initialConsent,
        isLoaded: true,
      };
    });
  }, [onOneTrustLoaded]);

  const optanonWrapper = React.useCallback(() => {
    setInitialConsent();
    const OneTrustOnConsentChanged = window?.Optanon?.OnConsentChanged;
    if (OneTrustOnConsentChanged) {
      OneTrustOnConsentChanged((event) => {
        /* eslint-disable-next-line no-console */
        console.log(event);
        const activeGroups = event.detail || [];
        onConsentChanged && onConsentChanged(activeGroups);
        setOneTrust({ consent: activeGroups, isLoaded: true });
      });
    }
  }, [onConsentChanged, setInitialConsent]);

  React.useEffect(() => {
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
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
};

export { CookieConsentProvider, CookieConsentContext };
