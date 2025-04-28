import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const config = {
    plugins: [react()],
    base: "/",
  }

  if (command === "serve") {
    // Configuración específica para desarrollo
    return {
      ...config,
      server: {
        port: 3000,
        open: true,
        host: true,
      },
    }
  } else {
    // Configuración específica para producción
    return {
      ...config,
      build: {
        sourcemap: false,
        minify: "esbuild",
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
          output: {
            manualChunks: {
              vendor: ["react", "react-dom"],
            },
          },
        },
      },
    }
  }
})
