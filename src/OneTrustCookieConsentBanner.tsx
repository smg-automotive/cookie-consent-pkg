import { FC, useEffect } from 'react';

type Props = {
  domainScript: string;
  enabled: boolean;
};

const OneTrustCookieConsentBanner: FC<Props> = ({ domainScript, enabled }) => {
  const src = 'https://cdn.cookielaw.org/scripttemplates/otSDKStub.js';

  useEffect(() => {
    if (document && enabled) {
      const script = document.createElement('script');
      script.src = src;
      script.type = 'text/javascript';
      script.dataset.domainScript = domainScript;
      script.dataset.documentLanguage = 'true';
      script.async = true;
      document.head.appendChild(script);
    }
  }, [enabled, domainScript]);

  return null;
};

export default OneTrustCookieConsentBanner;
