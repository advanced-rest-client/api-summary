const { playwrightLauncher } = require('@web/test-runner-playwright');

module.exports = {
  files: 'test/**/*.test.js',
  nodeResolve: true,
  coverage: true,
  browsers: [
    playwrightLauncher({ product: 'chromium' }),
    playwrightLauncher({ product: 'firefox' }),
    playwrightLauncher({ product: 'webkit' })
  ],
  testFramework: {
    config: {
      timeout: '60000',
    },
  },
  browserStartTimeout: 60000,
  testsStartTimeout: 60000,
  testsFinishTimeout: 60000,
  coverageConfig: {
    include: ['src/**/*.js'],
    exclude: ['test/**/*.js', 'demo/**/*.js'],
    threshold: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80
    }
  },
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
        <script>
          window.process = { env: { NODE_ENV: "development" } };
        </script>
      </head>
      <body>
        <script type="module" src="${testFramework}"></script>
      </body>
    </html>
  `
}; 