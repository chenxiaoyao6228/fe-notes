const path = require("path");
const fs = require("fs");
const Koa = require("koa");
const KoaStatic = require("koa-static");
const customAliasPlugin = require("./babel-plugin-custom-alias");
const babel = require("@babel/core");

let mapping = {};

function createServer() {
  const app = new Koa();

  const context = {
    app,
    rootPath: process.cwd(),
  };

  const resolvePlugins = [
    moduleRewirePlugin, // 重写路径为 /@modules/xxx
    moduleResolvePlugin, //
    serverStaticPlugin, // 静态服务插件，返回文件内容
  ];

  resolvePlugins.forEach((plugin) => plugin(context));

  setupDevDepsAssets(process.cwd());

  app.listen(8000, () => {
    console.log("mini-vite server启动成功！");
  });
}

createServer();

const regex = /^\/@modules\//;
function moduleResolvePlugin({ app, context }) {
  app.use(async (ctx, next) => {
    if (!regex.test(ctx.path)) {
      return next();
    }
    const id = ctx.path.replace(regex, "");
    console.log("id", id);

    ctx.type = "application/javascript";

    const content = fs.readFileSync(mapping[id].targetPath, "utf-8");

    ctx.body = content;
  });
}

function serverStaticPlugin({ app, rootPath }) {
  app.use(KoaStatic(rootPath));
  app.use(KoaStatic(rootPath, "/public"));
}

function moduleRewirePlugin({ app, context }) {
  app.use(async (ctx, next) => {
    await next();
    if (ctx.body && ctx.response.is("jsx")) {
      // 初始的 ctx.body 是一个 Readable 流，需要转换成字符串
      const jsxCode = await readBody(ctx.body);
      // 通过babel转换jsx代码
      const transformedCode = babel.transform(jsxCode, {
        plugins: [
          "@babel/plugin-transform-react-jsx-development", // 引入jsx
          customAliasPlugin,
        ],
      }).code;

      ctx.type = "application/javascript";
      ctx.body = transformedCode;
    }
  });
}

function readBody(stream) {
  return new Promise((resolve, reject) => {
    if (!stream.readable) {
      resolve(stream);
    } else {
      let res = "";
      stream.on("data", (data) => {
        res += data;
      });
      stream.on("end", () => {
        resolve(res);
      });
      stream.on("error", (err) => {
        reject(err);
      });
    }
  });
}

/**
 * 依赖预构建，将react, react-dom, scheduler等第三方库转换成ES Module， 写入开发临时文件夹
 * @param {*} rootPath
 */
function setupDevDepsAssets(rootPath) {
  //查看node_modules/.mini-vite
  const tempDevDir = path.resolve(rootPath, "node_modules", ".mini-vite");

  if (!fs.existsSync(tempDevDir)) {
    fs.mkdirSync(tempDevDir);
  }
  // 将项目中的 react, react-dom, scheduler 等第三方库转换成 ES Module，写入到 node_modules/.mini-vite 目录下
  // 这里只是简化，实际上要从index.html中开始递归查找依赖，然后再转换
   mapping = {
    react: {
      sourcePath: path.resolve(
        rootPath,
        "node_modules/react/cjs/react.development.js"
      ),
      targetPath: path.resolve(tempDevDir, "react.js"),
    },
    "react-dom/client": {
      sourcePath: path.resolve(
        rootPath,
        "node_modules/react-dom/cjs/react-dom.development.js"
      ),
      targetPath: path.resolve(tempDevDir, "react-dom.js"),
    },
    scheduler: {
      sourcePath: path.resolve(
        rootPath,
        "node_modules/scheduler/cjs/scheduler.development.js"
      ),
      targetPath: path.resolve(tempDevDir, "scheduler.js"),
    },
    ['react/jsx-dev-runtime']: {
      sourcePath: path.resolve(
        rootPath,
        "node_modules/react/cjs/react-jsx-dev-runtime.development.js"
      ),
      targetPath: path.resolve(tempDevDir, "jsx-dev-runtime.js"),
    },
  };

  Object.keys(mapping).forEach((key) => {
    const { sourcePath, targetPath } = mapping[key];
    transformCjsToEsm(sourcePath, targetPath);
  });

  /**
   * 将 CommonJS 转换成 ES Module，部分三方库没有提供 ES Module 版本，比如React
   * @param {*} sourcePath
   * @param {*} targetPath
   */
  function transformCjsToEsm(sourcePath, targetPath) {
    const content = fs.readFileSync(sourcePath, "utf-8");
    const babel = require("@babel/core");

    // 转换CommonJS代码为esm
    const transformedCode = babel.transform(content, {
      plugins: [
        "transform-commonjs",
      ],
    }).code;

    // 路径重写，将 require('react') 转换成 require('/@modules/react')
    // TODO: 两段代码合并
    const pathRewritedCode = babel.transform(transformedCode, {
      plugins: [customAliasPlugin],
    }).code;

    fs.writeFileSync(targetPath, pathRewritedCode);
  }
}
