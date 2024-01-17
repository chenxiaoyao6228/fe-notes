const path = require("path");

module.exports = {
  entry: "./src/index.js",
  devtool: false,
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  mode: "production",
};
// module.exports = {
//   mode: "development",
//   entry: "./src/index.js",
//   devtool: 'source-map',
//   output: {
//     filename: "main.js",
//     path: path.resolve(__dirname, "dist"),
//   },
//   optimization: {
//     usedExports: true,
//   }
// };
