import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       '/api': {
//         target: 'https://localhost:7233',
//         changeOrigin: true,
//         secure: false,
//       },
//     },
//   },
// })

export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    server: {
      host: "0.0.0.0",
      port: 3000,
      proxy: mode === 'development' ? {
        '/api': {
          target: 'http://localhost:7233',
          changeOrigin: true,
          secure: false,
        },
      } : undefined
    },
    resolve: {
      alias: {
        '@': '/src',
      },
    }
  }
})
