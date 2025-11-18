import esbuildPluginTsc from "esbuild-plugin-tsc";

export default () => ({
  minify: true,
  bundle: true,
  sourcemap: false,
  exclude: ["@aws-sdk/*"],
  external: ["@aws-sdk/*"],
  plugins: [esbuildPluginTsc()],
});
