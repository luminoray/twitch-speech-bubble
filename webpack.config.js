const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "static"},
        { from: "static/config.js", info: {minimized: true}}
      ],
    })
  ]
};