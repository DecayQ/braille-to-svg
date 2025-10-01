const { defineConfig } = require("@vue/cli-service");
const packageJSON = require("./package.json");

module.exports = defineConfig({
  transpileDependencies: true,

  publicPath:
    process.env.NODE_ENV === "production" ? `/${packageJSON.name}/` : "/",

  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          // less vars，customize ant design theme
          "primary-color": "#31a0d3",
          // 'link-color': '#F5222D',
          "border-radius-base": "6px",
        },
        // DO NOT REMOVE THIS LINE
        javascriptEnabled: true,
      },
    },
  },

  devServer: {
    https: true,
    port: 24929,
  },
});
