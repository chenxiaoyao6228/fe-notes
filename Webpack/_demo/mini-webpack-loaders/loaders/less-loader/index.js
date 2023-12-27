const less = require("less");

module.exports = function (source) {
  // 使用 less 包解析 LESS 代码
  less.render(source, (error, result) => {
    if (error) {
      this.emitError(error); // 将错误传递给 Webpack 处理
      return;
    }

    // 返回转换后的 CSS 代码
    this.callback(null, result.css, result.map);
  });
};
