import { playwrightLauncher } from '@web/test-runner-playwright';

export default {
  nodeResolve: true,
  browsers: [
    playwrightLauncher({
      product: 'chromium',
      launchOptions: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        timeout: 20000
      }
    }),
    playwrightLauncher({ product: 'firefox' }),
    playwrightLauncher({ 
      product: 'webkit',
      launchOptions: {
        headless: true,
        args: ['--no-sandbox'],
        timeout: 20000
      }
    })
  ],
  testFramework: {
    config: {
      timeout: '20000',
    },
  },
  files: ['test/**/*.test.js'],
  middleware: [
    function rewriteBase(context, next) {
      if (context.url.startsWith('/base/')) {
        context.url = context.url.replace('/base/', '/');
      }
      return next();
    }
  ],
  testRunnerHtml: testFramework => `
    <html>
      <head>
        <script type="module">
          // Set a base path for resources
          const base = document.createElement('base');
          base.href = '/';
          document.head.appendChild(base);
        </script>
      </head>
      <body>
        <script type="module" src="${testFramework}"></script>
      </body>
    </html>
  `,
  browserStartTimeout: 60000,
  testsStartTimeout: 60000,
  testsFinishTimeout: 60000,
  concurrentBrowsers: 1,
  concurrency: 1
};
