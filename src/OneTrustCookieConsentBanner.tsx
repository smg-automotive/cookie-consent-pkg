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
      document.head.insertBefore(script, document.head.firstChild);
    }
  }, [enabled, domainScript]);

  return null;
};

export default OneTrustCookieConsentBanner;
