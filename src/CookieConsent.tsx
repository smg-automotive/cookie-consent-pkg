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
  openPreferenceCenter?: () => void;
};

const CookieConsentContext = React.createContext<Context>({
  currentConsent: [],
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
  const [isInitialConsentSet, setIsInitialConsentSet] = React.useState(false);

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
      };
    } else {
      setCurrentConsent([Category.StrictlyNecessaryCookies]);
    }
  }, [enabled]);

  React.useEffect(() => {
    if (!isInitialConsentSet) {
      setCurrentConsent((prevConsent) =>
        prevConsent.length
          ? prevConsent
          : (window.OnetrustActiveGroups?.split(',') as Category[])
      );
      setIsInitialConsentSet(true);
    }
  }, [window.OnetrustActiveGroups, isInitialConsentSet]);

  const openPreferenceCenter = () => {
    window.OneTrust?.ToggleInfoDisplay();
  };

  return (
    <CookieConsentContext.Provider
      value={{ currentConsent, openPreferenceCenter }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
};

export { CookieConsentProvider, CookieConsentContext };
