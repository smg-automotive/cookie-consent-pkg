import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react';

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

const CookieConsentContext = createContext<Context>({
  consent: [],
  isLoaded: false,
  openPreferenceCenter: () => null,
});

type Props = {
  enabled: boolean;
  onConsentChanged?: (newConsent: Category[]) => void;
};

type OneTrust = {
  consent: Category[];
  isLoaded: boolean;
};

const CookieConsentProvider: FC<PropsWithChildren<Props>> = ({
  enabled,
  onConsentChanged,
  children,
}) => {
  const [oneTrust, setOneTrust] = useState<OneTrust>({
    consent: [Category.StrictlyNecessaryCookies],
    isLoaded: false,
  });

  const setInitialConsent = useCallback(() => {
    setOneTrust((prevOneTrust) => {
      if (prevOneTrust.isLoaded) return prevOneTrust;

      const oneTrustActiveGroups = (
        window.OnetrustActiveGroups?.split(',') as Category[]
      )?.filter(Boolean);
      return {
        consent:
          oneTrustActiveGroups && oneTrustActiveGroups.length
            ? oneTrustActiveGroups
            : prevOneTrust.consent,
        isLoaded: true,
      };
    });
  }, []);

  const optanonWrapper = useCallback(() => {
    const OneTrustOnConsentChanged = window?.Optanon?.OnConsentChanged;
    if (OneTrustOnConsentChanged) {
      OneTrustOnConsentChanged((event) => {
        const activeGroups = event.detail || [];
        onConsentChanged && onConsentChanged(activeGroups);
        setOneTrust({ consent: activeGroups, isLoaded: true });
      });
    }
  }, [onConsentChanged]);

  useEffect(() => {
    if (!enabled) return;
    window.OptanonWrapper = optanonWrapper;
    setInitialConsent();
  }, [enabled, optanonWrapper, setInitialConsent]);

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
