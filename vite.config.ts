import react from '@vitejs/plugin-react-swc';
import { visualizer } from 'rollup-plugin-visualizer';
import { ConfigEnv, defineConfig, loadEnv, UserConfig } from 'vite';
import viteCompression from 'vite-plugin-compression';
import { createHtmlPlugin } from 'vite-plugin-html';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function wrapperEnv(envConf: Record<string, any>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ret: Record<string, any> = {};
  for (const envName of Object.keys(envConf)) {
    let relName = envConf[envName];
    relName = relName === 'true' ? true : relName === 'false' ? false : relName;

    switch (envName) {
      case 'VITE_PORT':
        relName = Number(relName);
        break;
      default:
        break;
    }

    ret[envName] = relName as string;
    process.env[envName] = relName as string;
  }
  return ret;
}

export default defineConfig((mode: ConfigEnv): UserConfig => {
  const env = loadEnv(mode.mode, process.cwd());
  const viteEnv = wrapperEnv(env);

  return {
    plugins: [
      react(),
      createHtmlPlugin({
        inject: {
          data: {
            title: viteEnv.VITE_APP_TITLE,
          },
        },
      }),
      viteEnv.VITE_REPORT &&
        visualizer({
          open: true,
          gzipSize: true,
          brotliSize: true,
          filename: 'dist/bundle.html',
        }),
      viteEnv.VITE_BUILD_GZIP &&
        viteCompression({
          verbose: true,
          disable: false,
          deleteOriginFile: false,
          threshold: 10240,
          algorithm: 'gzip',
          ext: '.gz',
        }),
    ],
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    css: {
      modules: {
        localsConvention: 'camelCaseOnly',
      },
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: `@import "@/styles/var.scss";`,
        },
      },
    },
    server: {
      host: '0.0.0.0',
      port: viteEnv.VITE_PORT,
      open: viteEnv.VITE_OPEN,
      strictPort: true,
      cors: true,
      hmr: {
        overlay: true,
      },
      proxy: {
        '/api': {
          target: viteEnv.VITE_PROXY_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    esbuild: {
      pure: viteEnv.VITE_DROP_CONSOLE ? ['console.log', 'debugger'] : [],
    },
    build: {
      outDir: 'dist',
      chunkSizeWarningLimit: 2048,
      sourcemap: viteEnv.VITE_SOURCEMAP,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: viteEnv.VITE_DROP_CONSOLE,
          drop_debugger: true,
        },
      },
      rollupOptions: {
        output: {
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString();
            }
          },
        },
      },
    },
  };
});
