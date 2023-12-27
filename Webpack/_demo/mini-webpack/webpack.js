const fs = require("fs");
const path = require("path");
const { parse } = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const { transformFromAstSync } = require("@babel/core");


function miniWebpack(config) {
  const {entry, output} = config;

  // 获取文件名，读取文件内容，解析文件内容，获取依赖关系，转换代码
let ID = 0;
function createAsset(filename) {
  const content = fs.readFileSync(filename, "utf-8");

  const ast = parse(content, {
    sourceType: "module",
  });

  const dependences = [];

  traverse(ast, {
    ImportDeclaration: ({ node }) => {
      dependences.push(node.source.value);
    },
  });

  console.log(dependences);
  const id = ID++;

  const { code } = transformFromAstSync(ast, null, {
    presets: ["@babel/preset-env"],
  });

  return {
    id,
    filename,
    dependences,
    code,
  };
}


function createGraph(entry) {
  const mainAsset = createAsset(entry);
  const queue = [mainAsset];

  for (const asset of queue) {
    const dirname = path.dirname(asset.filename);

    asset.mapping = {};

    asset.dependences.forEach((relativePath) => {
      const absolutePath = path.join(dirname, relativePath);

      const child = createAsset(absolutePath);

      asset.mapping[relativePath] = child.id;

      queue.push(child);
    });
  }

  console.log("queue", queue);

  return queue;
}

function bundle(graph) {
  let modules = "";

  graph.forEach((mod) => {
    modules += `${mod.id}: [
      function(require, module, exports) { ${mod.code} },
      ${JSON.stringify(mod.mapping)}
    ],`;
  });

  const result = `
    (function(modules){
      function require(id) {
        const [fn, mapping] = modules[id];

        function locateRequire(relativePath) {
          return require(mapping[relativePath]);
        }

        const module = { exports: {} };
        fn(locateRequire, module, module.exports);
        return module.exports;
      }
      require(0);
    })({${modules}})
  `;

  return result;
}

// 生成依赖图
const graph = createGraph(entry);
// 生成代码
const result = bundle(graph);
// 写入文件
fs.writeFileSync(output, result);

}

miniWebpack({
  entry: "./src/index.js",
  output: "./dist/bundle.js",
})