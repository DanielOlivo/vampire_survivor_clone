import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  // resolve: {
  //   alias: {
  //     '@dimforge/rapier2d': 'node_module/@dimforge/rapier2d/rapier-compat.js'
  //   }
  // },

  server: {
    port: 8080,
    open: true,
  },
  base: "/vampire_survivor_clone/",
  build: {
    outDir: "dist",
  },
});
