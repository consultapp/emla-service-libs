import { defineConfig } from 'vite'
import { resolve } from 'path'

const useHash = false

const config = {
  ElmaUMDController: {
    entry: resolve(__dirname, './src/ElmaUMDController.ts'),
  },
  ElmaReactLauncher: {
    entry: resolve(__dirname, './src/ElmaReactLauncher.ts'),
  },
}

const currentConfig = config[process.env.LIB_NAME]
const libName = process.env.LIB_NAME

if (currentConfig === undefined) {
  throw new Error('LIB_NAME is not defined or is not valid')
}

export default defineConfig({
  define: {
    'process.env': { NODE_ENV: 'production' },
  },

  build: {
    lib: {
      ...currentConfig,
      outDir: './dist/' + libName,
      formats: ['umd'],
      name: libName,
      fileName: (format) =>
        `${libName}${useHash ? '-[hash]' : ''}.${format}.js`,
    },
    emptyOutDir: false,
  },
})
