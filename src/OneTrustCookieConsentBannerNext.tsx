import * as React from 'react';
// eslint-disable-next-line import/no-internal-modules
import Script from 'next/script';

type Props = {
  domainScript: string;
};

const OneTrustCookieConsentBannerNext: React.FC<Props> = ({ domainScript }) => {
  const href = 'https://cdn.cookielaw.org/scripttemplates/otSDKStub.js';

  return (
    <Script
      src={href}
      data-domain-script={domainScript}
      strategy="beforeInteractive"
    />
  );
};

export default OneTrustCookieConsentBannerNext;
