import {
  createContext,
  FC,
  PropsWithChildren,
  useEffect,
  useState,
} from 'react';

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

const CookieConsentContext = createContext<Context>({
  currentConsent: [],
  openPreferenceCenter: undefined,
});

type Props = {
  enabled: boolean;
};

const CookieConsentProvider: FC<PropsWithChildren<Props>> = ({
  enabled,
  children,
}) => {
  const [currentConsent, setCurrentConsent] = useState<Category[]>([]);

  useEffect(() => {
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

  useEffect(() => {
    setCurrentConsent((prevConsent) =>
      prevConsent.length
        ? prevConsent
        : (window.OnetrustActiveGroups.split(',') as Category[])
    );
  }, []);

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
