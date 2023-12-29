const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    app: "./src/index.js",
    // print: "./src/print.js",
    // hot: "webpack/hot/dev-server.js",
    // client: "webpack-dev-server/client/index.js?hot=true&live-reload=true",
  },
  devServer: {
    static: path.resolve(__dirname, "dist"),
    hot: true,
    // hot: false,
    // client: false,
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Hot Module Replacement",
      template: "./dist/index.html",
    }),
    // new webpack.HotModuleReplacementPlugin(),
  ],
};
