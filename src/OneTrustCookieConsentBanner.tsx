import * as React from 'react';
import { useEffect } from 'react';

type Props = {
  domainScript: string;
};

const OneTrustCookieConsentBanner: React.FC<Props> = ({ domainScript }) => {
  const src = 'https://cdn.cookielaw.org/scripttemplates/otSDKStub.js';

  const loadOneTrust = () => {
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.href = src;
    preloadLink.as = 'script';
    document.head.appendChild(preloadLink);

    const script = document.createElement('script');
    script.src = src;
    script.type = 'text/javascript';
    script.dataset.domainScript = domainScript;
    script.async = true;
    document.head.appendChild(script);
  };

  useEffect(() => {
    if (document) {
      loadOneTrust();
    }
  }, []);

  return null;
};

export default OneTrustCookieConsentBanner;
