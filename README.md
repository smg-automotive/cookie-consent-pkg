# cookie-consent-pkg

[![CircleCI](https://circleci.com/gh/smg-automotive/cookie-consent-pkg/tree/main.svg?style=svg&circle-token=c183f151fea3c74453cf8dd962d31e115906a300)](https://circleci.com/gh/smg-automotive/cookie-consent-pkg/tree/main)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

## Usage
```
npm install @smg-automotive/cookie-consent-pkg
```

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
make sure your merge commit message adheres to the corresponding [conventions](https://www.conventionalcommits.org/en/v1.0.0/) and your branch name does not contain forward slashes `/`.