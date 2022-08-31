import {
  createContext,
  FC,
  PropsWithChildren,
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
  currentConsent: Category[];
  isOneTrustLoaded: boolean;
  openPreferenceCenter: () => void;
};

const CookieConsentContext = createContext<Context>({
  currentConsent: [],
  isOneTrustLoaded: false,
  /* eslint-disable-next-line @typescript-eslint/no-empty-function */
  openPreferenceCenter: () => {},
});

type Props = {
  enabled: boolean;
  onConsentChanged?: (newConsent: Category[]) => void;
};

const CookieConsentProvider: FC<PropsWithChildren<Props>> = ({
  enabled,
  onConsentChanged,
  children,
}) => {
  const [currentConsent, setCurrentConsent] = useState<Category[]>([]);
  const [isOneTrustLoaded, setIsOneTrustLoaded] = useState(false);

  const setInitialConsent = () => {
    setCurrentConsent((prevConsent) =>
      prevConsent.length
        ? prevConsent
        : (window.OnetrustActiveGroups?.split(',') as Category[]).filter(
            Boolean
          )
    );
  };

  useEffect(() => {
    if (enabled) {
      window.OptanonWrapper = () => {
        const OneTrustOnConsentChanged = window?.Optanon?.OnConsentChanged;
        if (OneTrustOnConsentChanged) {
          OneTrustOnConsentChanged((event) => {
            const activeGroups = event.detail || [];
            onConsentChanged && onConsentChanged(activeGroups);
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
