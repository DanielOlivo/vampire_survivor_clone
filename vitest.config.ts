import { defineConfig } from "vitest/config";
// import {fileURLToPath, URL} from 'node:url'

export default defineConfig({
  test: {
    // environment: 'node',
    environment: "jsdom",
    globals: true,
    // setupFiles: ['./tests/setup.ts'],

    // setupFiles: ['./tests/setup.ts'],

    // server: {
    //     deps: {
    //         inline: [
    //             // 'pixi.js',
    //             // '@pixi/ui',
    //             // '@dimforge/rapier2d',
    //             '@dimforge/rapier2d-compat'
    //         ]
    //     }
    // }

    // deps: {
    //     inline
    // }
  },
});
