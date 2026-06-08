// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
      vite: {
    plugins: [tailwindcss()],
  },
  site: 'https://BenjaminConklin.github.io',
  base: '/lunch-shake-app',
});
