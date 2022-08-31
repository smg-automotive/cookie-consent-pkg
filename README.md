# cookie-consent-pkg

[![CircleCI](https://circleci.com/gh/smg-automotive/cookie-consent-pkg/tree/main.svg?style=svg&circle-token=c183f151fea3c74453cf8dd962d31e115906a300)](https://circleci.com/gh/smg-automotive/cookie-consent-pkg/tree/main)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

## Usage

```
npm install @smg-automotive/cookie-consent-pkg
```

### Loading OneTrust banner

````tsx
import {OneTrustCookieConsentBanner} from '@smg-automotive/cookie-consent-pkg';

<OneTrustCookieConsentBanner domainScript="yourScriptID"/>
````

`OneTrustCookieConsentBanner` adds the required script tags to the document head and preloads the script so that it
loads as early as possible. Alternatively, if you are in a Next.js environment, you can add the following to the _
document.tsx component:

````tsx
import Script from 'next/script';

<Script
    src="https://cdn.cookielaw.org/scripttemplates/otSDKStub.js"
    data-domain-script="yourScriptID"
    strategy="beforeInteractive"
/>
````

### CookieConsentProvider

You should wrap your application with the `CookieConsentProvider`. It places listeners on the current cookie consent and
enables you to react on changes (e.g. block certain third party scripts).

```tsx
<CookieConsentProvider
    enabled={true}
    onConsentChanged={(newConsent) => console.log(newConsent)}
>
    <div>your app..</div>
</CookieConsentProvider>
```

`onConsentChanged` is optional and allows you to fire events when the user changed the consent in the preference center.

### CookieConsentContext

You can get the current consent and other properties related to cookie consent in your component
using `CookieConsentContext`.

````tsx
import {CookieConsentContext} from '@smg-automotive/cookie-consent-pkg';

const {currentConsent, openPreferenceCenter, isOneTrustLoaded} = useContext(CookieConsentContext);
````

| property             | type       | description                                                                                                                                           |
|----------------------|------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
| currentConsent       | Category[] | Array of the current consent. If the user uses a script blocker or you disabled OneTrust in the Provider, only the stricly necessary category is set. |
| openPreferenceCenter | Function   | Opens the OneTrust preference center.                                                                                                                 |
| isOneTrustLoaded     | boolean    | True if OneTrust has been successfully loaded and invoked.                                                                                            |

## Development

```
npm run build
```

You can link your local npm package to integrate it with any local project:

```
cd cookie-consent-pkg
npm run build

cd <project directory>
npm link ../cookie-consent-pkg
```

## Release a new version

New versions are released on the ci using semantic-release as soon as you merge into master. Please
make sure your merge commit message adheres to the
corresponding [conventions](https://www.conventionalcommits.org/en/v1.0.0/) and your branch name does not contain
forward slashes `/`.
