const { transform } = require("@babel/core");

function loader(source) {
  // 获取 Loader 配置的选项
  const options = this.getOptions();

  console.log("babel-loader: ", options);

  // 使用 Babel 转换代码
  const transformedCode = transform(source, {
    ...options,
    sourceMap: true,
  }).code;

  return transformedCode;
}

module.exports = loader;
