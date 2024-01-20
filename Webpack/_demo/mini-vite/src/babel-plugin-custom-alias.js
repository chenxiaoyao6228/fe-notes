module.exports = function ({ types: t }) {
  return {
    visitor: {
      ImportDeclaration(path, state) {
        const { node } = path;
        const id = node.source.value;
        // 简化场景： 不是以 / . 开头的，都是第三方模块，不考虑alias等其他情况
        if (/^[^\/\.]/.test(id)) {
          node.source = t.stringLiteral("/@modules/" + id);
        }
      },
    },
  };
};
