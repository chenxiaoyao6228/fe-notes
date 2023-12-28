
function urlLoader(source) {

  console.warn("url-loader: ", source.size);

  // 获取 loader 的 options（配置）
  const options = this.getOptions() || { limit: 200000 };

  // 如果文件大小小于指定的阈值，则转为 Data URL
  if (options.limit && source.length < options.limit) {
    const base64 = Buffer.from(source, "binary").toString("base64");
    return `module.exports="data:${
      this.resourceMimeType || "application/octet-stream"
    };base64,${base64}"`;
  }

  // 否则，使用file-loader处理
  return require("../file-loader").call(this, source);
}

urlLoader.raw = true;
module.exports = urlLoader;
