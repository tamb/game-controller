const path = require("path");
const TypescriptDeclarationPlugin = require("typescript-declaration-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const prod = {
  path: path.resolve(__dirname, "dist"),
  filename: "main.js",
  library: {
    name: "GamController",
    type: "umd",
  },
};

const prodInput = {
  index: "./src/index.ts",
};

const demoInput = {
  index: "./src/demo.ts",
};

module.exports = (env) => {
  const plugins = env.demo
    ? [
        env.demo
          ? new HtmlWebpackPlugin({
              template: "src/index.html",
            })
          : null,
        new TypescriptDeclarationPlugin(),
      ]
    : [new TypescriptDeclarationPlugin()];

  return {
    mode: "production",
    entry: env.demo ? demoInput : prodInput,
    output: prod,
    plugins,
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            // Creates `style` nodes from JS strings
            "style-loader",
            // Translates CSS into CommonJS
            "css-loader",
            // Compiles Sass to CSS
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  plugins: [
                    [
                      "postcss-preset-env",
                      {
                        // Options
                      },
                    ],
                  ],
                },
              },
            },
            "sass-loader",
          ],
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js", ".jsx"],
    },
    //   plugins: [new TypescriptDeclarationPlugin()],
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin()],
    },
  };
};
