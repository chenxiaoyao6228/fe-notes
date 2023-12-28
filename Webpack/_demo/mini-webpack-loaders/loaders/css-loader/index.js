module.exports = function (source) {
  console.log("css-loader source: ", source);

  const classRegex = /(?<=\.)(.*?)(?={)/g; // 获取字符串所有类名的正则
  const classKeyMap = Object.fromEntries(
    source.match(classRegex).map((str) => [str.trim(), str.trim()])
  ); // 取出字符串中原始 CSS 类名
  return `/**__CSS_SOURCE__${source}*//**__CSS_CLASSKEYMAP__${JSON.stringify(
    classKeyMap
  )}*/`;
};
