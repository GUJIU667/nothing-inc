import { cp, mkdir, rm } from "node:fs/promises";
import { build } from "esbuild";

await rm("dist", { recursive: true, force: true });
await mkdir("dist/assets", { recursive: true });
await cp("src", "dist", { recursive: true, filter: (source) => !source.endsWith("site.js") });
await build({
  entryPoints: ["src/assets/site.js"],
  outfile: "dist/assets/site.js",
  bundle: true,
  minify: true,
  format: "iife",
  target: ["es2020"],
  legalComments: "none",
});
