import * as React from 'react';

import { Category } from './category';

declare global {
  interface Window {
    OptanonWrapper?: () => void;
    Optanon?: {
      OnConsentChanged?: (callback: (event: CustomEvent) => void) => void;
      Init?: (callback: (event: CustomEvent) => void) => void;
    };
    OneTrust: {
      ToggleInfoDisplay: () => void;
    };
    OnetrustActiveGroups: string;
  }
}

type Context = {
  currentConsent: Category[];
  isOneTrustLoaded: boolean;
  openPreferenceCenter?: () => void;
};

const CookieConsentContext = React.createContext<Context>({
  currentConsent: [],
  isOneTrustLoaded: false,
  openPreferenceCenter: undefined,
});

type Props = {
  enabled: boolean;
};

const CookieConsentProvider: React.FC<React.PropsWithChildren<Props>> = ({
  enabled,
  children,
}) => {
  const [currentConsent, setCurrentConsent] = React.useState<Category[]>([]);
  const [isOneTrustLoaded, setIsOneTrustLoaded] = React.useState(false);

  const setInitialConsent = () => {
    setCurrentConsent((prevConsent) =>
      prevConsent.length
        ? prevConsent
        : (window.OnetrustActiveGroups?.split(',') as Category[])
    );
  };

  React.useEffect(() => {
    if (enabled) {
      window.OptanonWrapper = () => {
        const OneTrustOnConsentChanged = window?.Optanon?.OnConsentChanged;
        if (OneTrustOnConsentChanged) {
          OneTrustOnConsentChanged((event) => {
            const activeGroups = event.detail || [];
            setCurrentConsent(activeGroups);
          });
        }

        setInitialConsent();
        setIsOneTrustLoaded(true);
      };
    } else {
      setCurrentConsent([Category.StrictlyNecessaryCookies]);
    }
  }, [enabled]);

  const openPreferenceCenter = () => {
    window.OneTrust?.ToggleInfoDisplay();
  };

  return (
    <CookieConsentContext.Provider
      value={{ currentConsent, openPreferenceCenter, isOneTrustLoaded }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
};

export { CookieConsentProvider, CookieConsentContext };
