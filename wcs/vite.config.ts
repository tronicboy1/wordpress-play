import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: "../src/plugins/austin-wc-plugin/public/js",
    emptyOutDir: false,
    minify: true,
    lib: {
      entry: [
        "src/svelte/wc-svelte.svelte",
        "src/lit/litwc-todo-lookup.ts",
        "src/lit/lit-hello.ts",
        "src/svelte/wc-svelte-todo.svelte",
        "src/svelte/wc-svelte-posts.svelte",
        "src/lit/wc-lit-websocket.ts",
      ],
      formats: ["es"],
    },
    rollupOptions: {
      external: [/^lit/, "rxjs"],
    },
  },
  plugins: [svelte({ compilerOptions: { customElement: true } })],
});
