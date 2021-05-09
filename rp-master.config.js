const os = require("os");

module.exports = {
  render: {
    concurrency: os.cpus().length,
    imageFormat: "png"
  },
  thumbs: {
    concurrency: os.cpus().length,
    browserHeight: 800,
    browserWidth: 1280,
    imageFormat: "png",
    output: "./thumbs/%s.png"
  }
};