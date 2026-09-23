// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import path from "node:path";
import { defineConfig as defineLovableConfig } from "@lovable.dev/vite-tanstack-config";
import { loadEnv, type ConfigEnv } from "vite";

export default async function config(env: ConfigEnv) {
  const serverEnv = loadEnv(env.mode, process.cwd(), "");
  Object.assign(process.env, serverEnv);

  return defineLovableConfig({
    tanstackStart: {
      // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
      // nitro/vite builds from this
      server: { entry: "server" },
    },
    vite: {
      resolve: {
        alias: {
          "entities/lib/decode.js": path.resolve(process.cwd(), "node_modules/entities/lib/decode.js"),
          "entities/lib/encode.js": path.resolve(process.cwd(), "node_modules/entities/lib/encode.js"),
          entities: path.resolve(process.cwd(), "node_modules/entities"),
        },
      },
    },
  })(env);
}
