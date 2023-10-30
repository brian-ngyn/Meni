const isObfscMode = process.env.NODE_ENV !== "development";

const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    "postcss-obfuscator": {
      enable: isObfscMode,
      extensions: [".tsx"],
      formatJson: true,
      callBack: function () {
        process.env.NODE_ENV = "production"; // to make sure postcss-obfuscator doesn't re-run.
      },
    },
  },
};

module.exports = config;
