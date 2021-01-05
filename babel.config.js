module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          node: "current",
        },
      },
    ],
    "@babel/preset-typescript",
  ],
  plugins: [
    [
      "module-resolver",
      {
        alias: {
          "@entities": "./src/entities",
          "@controllers": "./src/controllers",
          "@middlewares": "./src/middlewares",
          "@routes": "./src/routes",
          "@utils": "./src/utils",
        },
      },
    ],
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    ["@babel/plugin-proposal-class-properties", { loose: true }],
  ],
  ignore: ["**/*.spec.ts"],
};
