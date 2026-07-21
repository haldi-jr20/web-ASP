import { defineConfig } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import type { IncomingMessage, ServerResponse } from 'http'
import type { ViteDevServer } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id: string) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

// Plugin to serve the qgis/ folder as static files under /qgis path
function qgisStaticServer() {
  const qgisDir = path.resolve(__dirname, 'qgis')
  return {
    name: 'qgis-static-server',
    configureServer(server: ViteDevServer) {
      server.middlewares.use('/qgis', (req: IncomingMessage, res: ServerResponse, next: () => void) => {
        const reqPath = (req.url ?? '').split('?')[0].split('#')[0]
        const filePath = path.join(qgisDir, reqPath === '/' || reqPath === '' ? '/index.html' : reqPath)
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
          const ext = path.extname(filePath)
          const mimeTypes: Record<string, string> = {
            '.html': 'text/html',
            '.js':   'application/javascript',
            '.css':  'text/css',
            '.svg':  'image/svg+xml',
            '.png':  'image/png',
            '.jpg':  'image/jpeg',
            '.txt':  'text/plain',
          }
          res.setHeader('Content-Type', mimeTypes[ext] ?? 'application/octet-stream')
          fs.createReadStream(filePath).pipe(res)
        } else {
          next()
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    qgisStaticServer(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
