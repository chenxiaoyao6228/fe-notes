const path = require("path");
const fs = require("fs");
const Koa = require("koa");
const KoaStatic = require("koa-static");
const customAliasPlugin = require("./babel-plugin-custom-alias");

function createServer() {
  const app = new Koa();

  const context = {
    app,
    rootPath: process.cwd(),
  };
  const resolvePlugins = [
    moduleRewirePlugin,  // 重写路径为 /@modules/xxx
    moduleResolvePlugin, //
    serverStaticPlugin, // 静态服务插件，返回文件内容
  ];

  resolvePlugins.forEach((plugin) => plugin(context));
}

createServer();

const regex = /^\/@modules\//;
function moduleResolvePlugin({ app, context }) {
  app.use(async (ctx, next) => {
    if(!regex.test(ctx.path)) {
      return next()
    }
    const id = ctx.path.replace(regex, '');
    console.log("id", id);

    const mapping = {
      'react': path.resolve(process.cwd(), 'node_modules/react/index.js'),
      'react-dom/client': path.resolve(process.cwd(), 'node_modules/react-dom/client.js'),
    }

    ctx.type = 'application/javascript';

    const content =  fs.readFileSync(mapping[id], 'utf-8');

    ctx.body = content;
  });
}

function serverStaticPlugin({ app, rootPath }) {
  app.use(KoaStatic(rootPath));
  app.use(KoaStatic(rootPath, "/public"));

  app.listen(8000, () => {
    console.log("mini-vite server启动成功！");
  });
}

function moduleRewirePlugin({ app, context }) {
  app.use(async (ctx, next) => {
    await next();
    if (ctx.body && ctx.response.is("jsx")) {
      // 初始的 ctx.body 是一个 Readable 流，需要转换成字符串
      const jsxCode = await readBody(ctx.body);
      // 通过babel转换jsx代码
      const transformedCode = transformJsx(jsxCode);

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

function transformJsx(jsxCode) {
  const babel = require("@babel/core");

  const options = {
    // presets: ['@babel/preset-env'], // 注意这里不要使用 @babel/preset-env，因为它会将所有的代码都转换成 ES5，包括import
    plugins: [
      [
        "@babel/plugin-transform-react-jsx",
        {
          pragma: "React.createElement",
          pragmaFrag: "React.Fragment",
        },
      ],
      customAliasPlugin,
    ],
  };

  const { code } = babel.transform(jsxCode, options);

  // console.log("code", code);

  return code;
}
