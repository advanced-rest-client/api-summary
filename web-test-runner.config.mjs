import { esbuildPlugin } from '@web/dev-server-esbuild';
import { playwrightLauncher } from '@web/test-runner-playwright';

export default {
  files: 'test/**/*.test.js',
  nodeResolve: true,
  browsers: [
    playwrightLauncher({ product: 'chromium' }),
    playwrightLauncher({ product: 'firefox' }),
    playwrightLauncher({ product: 'webkit' }),
  ],
  plugins: [
    esbuildPlugin({ ts: true }),
  ],
  middleware: [
    function rewriteBase(context, next) {
      if (context.url.indexOf('/base') === 0) {
        context.url = context.url.replace('/base', '');
      }
      return next();
    }
  ],
  testFramework: {
    config: {
      timeout: '10000',
    },
  },
};
