import { defineConfig } from "rolldown";

export default defineConfig({
  input: "index.js",
  output: {
    file: "dist/index.js",
    format: "cjs",
    sourcemap: false,
  },
  external: ["curve25519-js", "protobufjs"],
});
