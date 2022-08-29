/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as React from 'react';

import { Category } from './category';

/*declare global {
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
}*/

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

  React.useEffect(() => {
    if (enabled) {
      // es
      // @ts-ignore
      window.OptanonWrapper = () => {
        // @ts-ignore
        const OneTrustOnConsentChanged = window?.Optanon?.OnConsentChanged;
        if (OneTrustOnConsentChanged) {
          // @ts-ignore
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
    setCurrentConsent((prevConsent) =>
      prevConsent.length
        ? prevConsent
        : // @ts-ignore
          (window.OnetrustActiveGroups.split(',') as Category[])
    );
  }, []);

  const openPreferenceCenter = () => {
    // @ts-ignore
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
