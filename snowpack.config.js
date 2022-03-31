// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    source: "/output",
    public: "/",
  },
  buildOptions: {
    clean: true,
  },
  optimize: {
    bundle: true,
    sourcemap: false,
  },
};
