import { useContext } from 'react';
import { act, renderHook } from '@testing-library/react';

import { CookieConsentContext, CookieConsentProvider } from '../CookieConsent';
import { Category } from '../category';

const wrapper = ({
  enabled,
  onConsentChanged,
}: {
  enabled: boolean;
  onConsentChanged?: (newConsent: Category[]) => void;
}) => {
  return ({ children }: { children: React.ReactNode }) => (
    <CookieConsentProvider
      enabled={enabled}
      onConsentChanged={onConsentChanged}
    >
      {children}
    </CookieConsentProvider>
  );
};

describe('CookieConsent', () => {
  it('sets the consent to strictly necessary if OneTrust is disabled', () => {
    const { result } = renderHook(() => useContext(CookieConsentContext), {
      wrapper: wrapper({ enabled: false }),
    });
    expect(result.current.currentConsent).toEqual([
      Category.StrictlyNecessaryCookies,
    ]);
    expect(result.current.isOneTrustLoaded).toEqual(false);
  });

  it('sets the initial consent on load', () => {
    window.OnetrustActiveGroups = `${Category.PerformanceCookies},${Category.FunctionalCookies}`;
    /* eslint-disable-next-line @typescript-eslint/no-empty-function */
    window.OptanonWrapper = function () {};
    const { result, rerender } = renderHook(
      () => useContext(CookieConsentContext),
      {
        wrapper: wrapper({ enabled: true }),
      }
    );

    act(() => {
      (window.OptanonWrapper as () => void)();
    });

    rerender();
    expect(result.current.currentConsent).toEqual([
      Category.PerformanceCookies,
      Category.FunctionalCookies,
    ]);
    expect(result.current.isOneTrustLoaded).toEqual(true);
  });

  it('opens the OneTrust preference center', () => {
    const openPreferenceCenter = jest.fn();
    window.OneTrust = { ToggleInfoDisplay: openPreferenceCenter };
    const { result } = renderHook(() => useContext(CookieConsentContext), {
      wrapper: wrapper({ enabled: true }),
    });
    result.current.openPreferenceCenter();
    expect(openPreferenceCenter).toHaveBeenCalled();
  });
});
