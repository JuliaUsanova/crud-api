import path from "node:path";
import webpack from "webpack";

const isProduction = process.env.NODE_ENV == "production";

const config = {
  mode: isProduction ? "production" : "development",
  target: "node",
  entry: "./src/index.ts",
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      filename: "[name].js.map",
    }),
  ],
  externals: [/node_modules/],
  module: {
    rules: [
      { test: /\.js$/, loader: "source-map-loader", enforce: "pre" },
      {
        test: /\.([cm]?ts|tsx)$/,
        loader: "ts-loader",
        exclude: ["/node_modules/"],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
};

export default config;
