import * as React from 'react';

type Props = {
  domainScript: string;
};

export enum Category {
  'StrictlyNecessaryCookies' = 'C0001',
  'PerformanceCookies' = 'C0002',
  'FunctionalCookies' = 'C0003',
  'TargetingCookies' = 'C0004',
  'SocialMediaCookies' = 'C0005',
}

const OneTrustCookieConsentBanner: React.FC<Props> = ({ domainScript }) => {
  const href = 'https://cdn.cookielaw.org/scripttemplates/otSDKStub.js';

  return (
    <>
      <link rel="preload" href={href} as="script" />
      <script
        async
        src={href}
        data-domain-script={domainScript}
        type="text/javascript"
      />
      <script
        type="text/javascript"
        dangerouslySetInnerHTML={{
          /* eslint-disable-next-line @typescript-eslint/naming-convention */
          __html: 'function OptanonWrapper() { }',
        }}
      />
    </>
  );
};

export default OneTrustCookieConsentBanner;
