const loaderUtils = require('loader-utils');

function fileLoader(source) {
  // 使用 loader-utils 的 interpolateName 函数根据内容生成一个文件名
  const filename = loaderUtils.interpolateName(this, '[name].[hash].[ext]', { content: source });
  
  // this.emitFile(filename, source): 用于将文件输出到输出目录。它接受文件名和文件内容作为参数。这确保文件包含在输出中，并可以被构建过程中的其他部分引用。
  this.emitFile(filename, source);

  return `module.exports="${filename}"`;
}

// 将 loader 的 raw 属性设置为 true，表示该 loader 处理二进制数据。在这里，这意味着文件内容被读取并作为 Buffer 输出。
fileLoader.raw = true;

module.exports = fileLoader;
