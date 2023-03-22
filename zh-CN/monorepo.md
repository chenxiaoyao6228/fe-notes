# Use-pnpm-workspace-changeset-to-setup-monorepo-in-2023

## Why Monorepo?

In my [js-rocks]() projects I have several packages like `lodash-tiny` and `react-tiny`, the folder structure looks like the following.

```
.
├── README.md
├── package.json
├── packages
│   ├── lodash-tiny
│   │   ├── package.json
│   │   ├── src
│   │   │   └── index.ts
│   │   └── tsconfig.json
│   └── react-tiny
│       ├── package.json
│       ├── src
│       │   └── index.ts
│       └── tsconfig.json
    .... other packages
├── pnpm-workspace.yaml
└── tsconfig.json
```

In the foreseeing future, there will be more and more packages added in. Each time I create a package, I have to repeat the setup process one more time.

so my goal is:

- Keep consistencies within the whole repo
- Easy to create a new package, no need to set up complicated config for each package（eg: Eslint, Jest, Typescript, Babel etc.)

## Pnpm

Pnpm is a new generation of package management tools, known as the most advanced package manager. According to the official website, the two goals of saving disk space, improving installation speed and creating a non-flat node_modules folder can be achieved.

### Installation

```sh
 npm install -g pnpm
```

### Remove lock file

If you have used `npm` or `yarn` before, try to remove `node_modules` and `yarn.lock` file in advance.

```bash
# remove all node_modules in this repo
find . -name 'node_modules' 'yarn.lock' -type d -prune -exec rm -rf '{}' +
```

### Install dependencies

Install `dependencies` to the root

```
pnpm install rollup -w
```

Install `devDependencies` to the root

```sh
pnpm install rollup -wD
```

Install package to be specific package

```sh
pnpm add @babel/preset-react --filter @js-rocks/react-tiny
```

### Only allow Pnpm for dependency management

### package.json

This is what your `package.json` looks like

```json
{
  "scripts": {
    "preinstall": "npx only-allow pnpm"
  }
}
```

## eslint && prettier

Install dependencies

```sh

pnpm i prettier prettier-eslint eslint eslint-config-prettier eslint-plugin-prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser -w

```

In your `.eslintrc.js`

```
module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  plugins: ['prettier', '@typescript-eslint'],
  parser: '@typescript-eslint/parser',
}
```

In your package.json

```json
{
  "scripts": {
    "format": "pnpm prettier-write && pnpm eslint-fix",
    "eslint-fix": "turbo run eslint-fix",
    "prettier-write": "turbo run prettier-write"
  }
}
```

For your `Vscode`, Install the following packages

```
"esbenp.prettier-vscode",
"stylelint.vscode-stylelint",
"redjue.git-commit-plugin",
"dbaeumer.vscode-eslint"
```

In `.vscode/settings.json`

```json
{
  "typescript.tsdk": "node_modules/typescript/lib", // tell vscode to use local installed typescript
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[jsonc]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "editor.codeActionsOnSave": {
    "source.fixAll": true,
    "source.fixAll.eslint": true,
    "source.fixAll.stylelint": true
  },
  "eslint.validate": [
    "javascript",
    "typescript",
    "reacttypescript",
    "reactjavascript"
  ]
}
```

## Babel

extend babel

`root`

```json
{
  "presets": ["@babel/preset-env"]
}
```

`react-tiny`

```js
module.exports = {
  extends: "../../babel.config.json",
  presets: ["@babel/preset-react"],
};
```

## Jest

```js
module.exports = {
  preset: "ts-jest",
  transform: {
    "^.+\\.(ts|tsx)?$": "ts-jest",
    "^.+\\.(js|jsx)$": "babel-jest",
  },
};
```

## commit

use `git-cz`

```sh
npx git-cz
```

## jest

## changeset

## Turbo

## Typescript

## bundler(rollup)

## CI

## Reference

<https://juejin.cn/post/7098609682519949325>

<https://www.developerway.com/posts/custom-eslint-rules-typescript-monorepo>

<https://blog.csdn.net/qq_21567385/article/details/122361591>

https://huafu.github.io/ts-jest/user/config/#advanced

https://jestjs.io/docs/cli#--selectprojects-project1--projectn

https://dev.to/mbarzeev/how-to-configure-babel-for-your-monorepo-j3c

https://babeljs.io/docs/config-files
