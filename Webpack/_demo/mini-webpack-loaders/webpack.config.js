const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  // devServer: {
  //   static: path.resolve(__dirname, "dist"),
  //   port: 9000,
  // },
  output: {
    publicPath: "/",
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: "./loaders/babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          "./loaders/style-loader",
          "./loaders/css-loader",
          "./loaders/less-loader",
        ],
      },
      // {
      //   test: /\.jpg$/,
      //   use: ["./loaders/file-loader"],
      // },
      {
        test: /\.(png|jpg)$/,
        use: [
          {
            loader: "./loaders/url-loader",
            options: {
              limit: 20480, // 小于 20kb 的图片转成 base64
            },
          },
        ],
      },
    ],
  },
  // plugins: [new HtmlWebpackPlugin({ template: "./dist/index.html" })],
};
