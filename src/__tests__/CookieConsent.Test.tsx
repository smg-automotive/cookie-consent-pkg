import * as React from 'react';
import { act, renderHook } from '@testing-library/react';

import { CookieConsentContext, CookieConsentProvider } from '../CookieConsent';
import { Category } from '../category';

const wrapper = ({
  enabled,
  onConsentChanged,
  onOneTrustLoaded,
}: {
  enabled: boolean;
  onConsentChanged?: (newConsent: Category[]) => void;
  onOneTrustLoaded?: (consent: Category[]) => void;
}) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <CookieConsentProvider
      enabled={enabled}
      onConsentChanged={onConsentChanged}
      onOneTrustLoaded={onOneTrustLoaded}
    >
      {children}
    </CookieConsentProvider>
  );
  return Wrapper;
};

describe('CookieConsent', () => {
  afterEach(() => {
    window.OnetrustActiveGroups = '';
  });

  it('sets the consent to strictly necessary if OneTrust is disabled', () => {
    const { result } = renderHook(
      () => React.useContext(CookieConsentContext),
      {
        wrapper: wrapper({ enabled: false }),
      }
    );
    expect(result.current.consent).toEqual([Category.StrictlyNecessaryCookies]);
    expect(result.current.isLoaded).toEqual(false);
  });

  it('sets the initial consent on load', () => {
    window.OnetrustActiveGroups = `${Category.PerformanceCookies},${Category.FunctionalCookies}`;
    /* eslint-disable-next-line @typescript-eslint/no-empty-function */
    window.OptanonWrapper = function () {};
    const { result, rerender } = renderHook(
      () => React.useContext(CookieConsentContext),
      {
        wrapper: wrapper({ enabled: true }),
      }
    );

    act(() => {
      (window.OptanonWrapper as () => void)();
    });

    rerender();
    expect(result.current.consent).toEqual([
      Category.PerformanceCookies,
      Category.FunctionalCookies,
    ]);
    expect(result.current.isLoaded).toEqual(true);
  });

  it('calls the onOneTrustLoaded with the initial consent', () => {
    const onOneTrustLoaded = jest.fn();
    window.OnetrustActiveGroups = `${Category.PerformanceCookies},${Category.FunctionalCookies}`;
    /* eslint-disable-next-line @typescript-eslint/no-empty-function */
    window.OptanonWrapper = function () {};
    const { rerender } = renderHook(
      () => React.useContext(CookieConsentContext),
      {
        wrapper: wrapper({ enabled: true, onOneTrustLoaded }),
      }
    );

    act(() => {
      (window.OptanonWrapper as () => void)();
    });

    rerender();
    expect(onOneTrustLoaded).toHaveBeenCalledWith(
      [Category.PerformanceCookies, Category.FunctionalCookies],
      false
    );
  });

  it('changes the consent if the user uses the preference center', () => {
    const onChange = jest.fn();
    const { result, rerender } = renderHook(
      () => React.useContext(CookieConsentContext),
      {
        wrapper: wrapper({ enabled: true, onConsentChanged: onChange }),
      }
    );

    // simulate OneTrustLoaded
    act(() => {
      (window.OptanonWrapper as () => void)();
    });
    rerender();
    expect(result.current.isLoaded).toEqual(true);
    expect(result.current.consent).toEqual([Category.StrictlyNecessaryCookies]);

    act(() => {
      window.Optanon = {
        OnConsentChanged: (handler: (event: CustomEvent) => void) => {
          handler({ detail: [Category.PerformanceCookies] } as CustomEvent);
        },
      };
      (window.OptanonWrapper as () => void)();
    });

    expect(result.current.consent).toEqual([Category.PerformanceCookies]);
    expect(onChange).toHaveBeenCalledWith([Category.PerformanceCookies]);
  });

  it('opens the OneTrust preference center', () => {
    const openPreferenceCenter = jest.fn();
    window.OneTrust = { ToggleInfoDisplay: openPreferenceCenter };
    const { result } = renderHook(
      () => React.useContext(CookieConsentContext),
      {
        wrapper: wrapper({ enabled: true }),
      }
    );
    result.current.openPreferenceCenter();
    expect(openPreferenceCenter).toHaveBeenCalled();
  });
});
