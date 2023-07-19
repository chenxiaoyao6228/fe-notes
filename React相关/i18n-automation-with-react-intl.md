## Preface

The `i18n` process is tedious, This article will help you build up an automation pipeline with `react-intl` step by step.

- Locale extraction
- Translation
- LintLocale
- Setup git hooks

## Locale extraction

First, install `react-intl`

```sh
yarn add react react-intl
```

Then, in your component

```jsx
import { useIntl } from 'react-intl';
const App = () = {
    const intl = useIntl();
    <Button>
           {intl.formatMessage({ id: 'id-hello',  defaultMessage: 'hello' })}
   </Button>
}
```

Install the corresponding cli

```
yarn add -D @formatjs/cli

```

Add the following script to your `package.json`

```json
{
  "scripts": {
    "extractLocale": "yarn extract && yarn compile",
    "extract": "formatjs extract 'src/pages/**/*.{js,jsx,ts,tsx}' --out-file temp.json --id-interpolation-pattern [sha512:contenthash:base64:6] --extract-source-location --throws",
    "compile": "formatjs compile temp.json --out-file src/locales/en-US.json && rm temp.json"
  }
}
```

When you run `extractLocale`, basically, the CLI tool will walk through all your react components defined in `src/pages` folder and extract every `id` and `defaultMessage` and outputs the corresponding file to `src/locales/en-US.json`

## Translation

add a `translate.js` to your `src/scripts` folder, you need to create your account from a translation services provider like `Google`, `Baidu` and etc. I will use `Baidu` as an example, you can replace the translation request endpoint described in the services provider's docs.

```js
const request = require("axios").default;
const { default: axios } = require("axios");
const fs = require("fs");
const path = require("path");

const md5 = require("md5");
(async () => {
  try {
    const originLang = "en";
    const distLangList = ["swe"];
    for (const lang of distLangList) {
      const originJSON = require(path.join(
        __dirname,
        "../src/locales",
        `${originLang}.json`
      ));
      const destJSONPath = path.join(
        __dirname,
        "../src/locales",
        `${lang}.json`
      );
      const destJSON = require(destJSONPath);
      for (const key in originJSON) {
        if (Object.hasOwnProperty.call(originJSON, key)) {
          const element = originJSON[key];
          if (!Object.hasOwnProperty.call(destJSON, key)) {
            destJSON[key] = await getTranslation(element, lang);
          }
        }
      }
      fs.writeFileSync(destJSONPath, JSON.stringify(destJSON, null, 2));
    }
  } catch (error) {
    console.log("error", error);
  }

  async function getTranslation(queryStr, distLang) {
    try {
      const sourceLang = "en";
      const APP_ID = "your_app_id";
      const SECRET = "your_app_secret";
      const SALT = "1435660288";
      const source = `${APP_ID}${queryStr}${SALT}${SECRET}`;
      const sign = md5(source);

      const { data } = await axios.get(
        `http://api.fanyi.baidu.com/api/trans/vip/translate?q=${encodeURIComponent(
          queryStr
        )}&from=${sourceLang}&to=${distLang}&appid=${APP_ID}&salt=${SALT}&sign=${sign}`
      );
      if (!data) {
        throw new Error(`translate ${queryStr} failed`);
      }
      return data.trans_result[0].dst;
    } catch (error) {
      throw error;
    }
  }
})();
```

## LintLocale

Install

```sh
yarn add eslint eslint-plugin-i18n-json -D
```

config your `.eslintrc.js`

```js
const path = require("path");
module.exports = {
  extends: ["plugin:i18n-json/recommended"],
  rules: {
    "i18n-json/valid-json": 2,
    "i18n-json/sorted-keys": 2,
    "i18n-json/identical-keys": [
      2,
      { filePath: path.resolve("./src/locales/en-US.json") },
    ],
    "i18n-json/valid-message-syntax": [
      2,
      {
        syntax: "non-empty-string",
      },
    ],
  },
};
```

add the following script to your `package.json`

```json
{
  "scripts": {
    "lintLocale": "eslint --ext .json --format node_modules/eslint-plugin-i18n-json/formatter.js src/locales --fix"
  }
}
```

## Setup git hooks

Install

```
yarn add husky  -D
```

in your package.json

```json
{
  "scripts": {
    "prepare": "husky install"
  }
}
```

execute the following command

```
yarn prepare
```

and you will see a `.husky` folder generated. then in `.husky/pre-commit` add the following

```sh
echo '----extract locales start--------'
yarn extractLocale
echo '----extract locales end--------'
echo '----translate locales start--------'
yarn translate
echo '----translate locales end--------'
echo '----lintLocale locales start--------'
yarn lintLocale
echo '----lintLocale locales end--------'
echo '----git add locales--------'
git add src/locales
echo '----lint-staged--------'
```
