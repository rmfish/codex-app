import { context, build } from "esbuild";
import { rmSync } from "node:fs";
import { resolve } from "node:path";

const isWatch = process.argv.includes("--watch");
const outdir = resolve("dist-electron");

const commonConfig = {
  bundle: true,
  format: "esm",
  platform: "node",
  target: "node18",
  sourcemap: true,
  external: ["electron"],
  define: {
    "process.env.NODE_ENV": JSON.stringify(
      process.env.NODE_ENV ?? (isWatch ? "development" : "production"),
    ),
  },
};

const builds = [
  {
    ...commonConfig,
    entryPoints: ["src/main/index.ts"],
    outfile: resolve(outdir, "main.js"),
  },
  {
    ...commonConfig,
    entryPoints: ["src/preload/index.ts"],
    outfile: resolve(outdir, "preload.js"),
  },
];

if (isWatch) {
  const contexts = await Promise.all(builds.map((config) => context(config)));
  await Promise.all(contexts.map((ctx) => ctx.watch()));
  process.stdout.write("[build-electron] watching main and preload bundles\n");
  await new Promise(() => {});
} else {
  rmSync(outdir, { force: true, recursive: true });
  await Promise.all(builds.map((config) => build(config)));
  process.stdout.write("[build-electron] wrote dist-electron assets\n");
}
