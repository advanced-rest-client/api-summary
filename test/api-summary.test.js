import { fixture, assert, aTimeout } from '@open-wc/testing';
import sinon from 'sinon/pkg/sinon-esm.js';
import '../api-summary.js';
import { AmfLoader } from './amf-loader.js';
import { IronMeta } from '@polymer/iron-meta/iron-meta.js';
import { chai } from '@bundled-es-modules/chai';
import { chaiDomDiff } from '@open-wc/semantic-dom-diff';

chai.use(chaiDomDiff);

describe('<api-summary>', function() {
  async function basicFixture() {
    return await fixture(`<api-summary aware="test"></api-summary>`);
  }

  async function baseUriFixture() {
    return await fixture(`<api-summary baseuri="https://domain.com"></api-summary>`);
  }

  async function awareFixture() {
    return await fixture(`
      <div>
        <api-summary aware="test-model"></api-summary>
        <raml-aware scope="test-model"></raml-aware>
      </div>
    `);
  }

  describe('Basic', () => {
    let element;
    let amf;
    before(async () => {
      amf = await AmfLoader.load();
    });

    beforeEach(async () => {
      element = await basicFixture();
      element.amf = amf;
      await aTimeout();
    });

    it('raml-aware is in the DOM', () => {
      const node = element.shadowRoot.querySelector('raml-aware');
      assert.ok(node);
    });

    it('renders api title', () => {
      const node = element.shadowRoot.querySelector('h1');
      assert.dom.equal(node, '<h1>API body demo</h1>');
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
      assert.dom.equal(
        node,
        `<div class="markdown-body" slot="markdown-html">
        <p>
          This is a description of demo API.
        </p>
        <p>
          This is
          <strong>
            markdown
          </strong>
          .
        </p>
      </div>`
      );
    });

    it('renders base uri', () => {
      const node = element.shadowRoot.querySelector('.url-value');
      assert.dom.equal(node, `<div class="url-value">https://{instance}.domain.com</div>`);
    });
  });

  describe('Base URI property', () => {
    let element;
    let amf;

    before(async () => {
      amf = await AmfLoader.load();
    });

    async function setupBaseUri() {
      element = await baseUriFixture();
      element.amf = amf;
      await aTimeout();
    }

    async function setupBasic() {
      element = await basicFixture();
      element.amf = amf;
      await aTimeout();
    }

    after(() => {
      new IronMeta({
        key: 'ApiBaseUri'
      }).value = undefined;
    });

    it('Sets URL from base uri', async () => {
      await setupBaseUri();
      const node = element.shadowRoot.querySelector('.url-value');
      assert.dom.equal(node, `<div class="url-value">https://domain.com</div>`);
    });

    it('Sets URL from iron-meta', async () => {
      new IronMeta({
        key: 'ApiBaseUri'
      }).value = 'https://meta.com/base';
      await setupBasic();
      const node = element.shadowRoot.querySelector('.url-value');
      assert.dom.equal(node, `<div class="url-value">https://meta.com/base</div>`);
    });

    it('In case of conflict base uri wins', async () => {
      new IronMeta({
        key: 'ApiBaseUri'
      }).value = 'https://meta.com/base';
      await setupBaseUri();
      const node = element.shadowRoot.querySelector('.url-value');
      assert.dom.equal(node, `<div class="url-value">https://domain.com</div>`);
    });
  });

  describe('OAS properties', () => {
    let amf;
    let element;

    before(async () => {
      amf = await AmfLoader.load('loan-microservice.json');
    });

    beforeEach(async () => {
      element = await basicFixture();
      element.amf = amf;
      await aTimeout();
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

  describe('Endppoints rendering', () => {
    let element;
    let amf;

    before(async () => {
      amf = await AmfLoader.load();
    });

    beforeEach(async () => {
      element = await basicFixture();
      element.amf = amf;
      await aTimeout();
    });

    it('adds separator', () => {
      const node = element.shadowRoot.querySelector('.separator');
      assert.ok(node);
    });

    it('renders all endpoints', () => {
      const nodes = element.shadowRoot.querySelectorAll('.endpoint-item');
      assert.lengthOf(nodes, 11);
    });

    it('renders endpoint name', () => {
      const node = element.shadowRoot.querySelectorAll('.endpoint-item')[2].querySelector('.endpoint-label');
      assert.dom.equal(
        node,
        `<span class="endpoint-label" data-shape-type="endpoint" title="Open endpoint documentation" role="button" tabindex="0">
        People
      </span>`,
        {
          ignoreAttributes: ['data-id']
        }
      );
    });

    it('sets data-id on name', () => {
      const node = element.shadowRoot.querySelectorAll('.endpoint-item')[2].querySelector('.endpoint-path');
      assert.notEmpty(node.getAttribute('data-id'));
    });

    it('renders endpoint path', () => {
      const node = element.shadowRoot.querySelectorAll('.endpoint-item')[2].querySelector('.endpoint-path');
      assert.dom.equal(
        node,
        `<div class="endpoint-path" data-shape-type="endpoint" title="Open endpoint documentation" role="button" tabindex="0">/people</div>`,
        {
          ignoreAttributes: ['data-id']
        }
      );
    });

    it('sets data-id on path', () => {
      const node = element.shadowRoot.querySelectorAll('.endpoint-item')[2].querySelector('.endpoint-path');
      assert.notEmpty(node.getAttribute('data-id'));
    });

    it('renders list of operations', () => {
      const nodes = element.shadowRoot.querySelectorAll('.endpoint-item')[2].querySelectorAll('.method-label');
      assert.lengthOf(nodes, 3);
    });

    it('renders operation method', () => {
      const node = element.shadowRoot.querySelectorAll('.endpoint-item')[2].querySelector('.method-label');
      assert.dom.equal(
        node,
        `<span class="method-label" data-method="get" data-shape-type="method" title="Open method documentation" role="button" tabindex="0">get</span>`,
        {
          ignoreAttributes: ['data-id']
        }
      );
    });

    it('Click on an endpoint dispatches navigation event', (done) => {
      const node = element.shadowRoot.querySelector(`.endpoint-label[data-id]`);
      element.addEventListener('api-navigation-selection-changed', (e) => {
        assert.typeOf(e.detail.selected, 'string');
        assert.equal(e.detail.type, 'endpoint');
        done();
      });
      node.click();
    });

    it('Click on an endpoint path dispatches navigation event', (done) => {
      const node = element.shadowRoot.querySelector(`.endpoint-path[data-id]`);
      element.addEventListener('api-navigation-selection-changed', (e) => {
        assert.typeOf(e.detail.selected, 'string');
        assert.equal(e.detail.type, 'endpoint');
        done();
      });
      node.click();
    });

    it('Click on a method dispatches navigation event', (done) => {
      const node = element.shadowRoot.querySelector(`.method-label[data-id]`);
      element.addEventListener('api-navigation-selection-changed', (e) => {
        assert.typeOf(e.detail.selected, 'string');
        assert.equal(e.detail.type, 'method');
        done();
      });
      node.click();
    });
  });

  describe('_computeBaseUri()', () => {
    let element;
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
    let element;

    beforeEach(async () => {
      element = await basicFixture();
      model = {
        'http://schema.org/provider': [
          {
            '@id': 'amf://id#369',
            '@type': ['http://schema.org/Organization', 'http://a.ml/vocabularies/document#DomainElement'],
            'http://schema.org/url': [
              {
                '@id': 'http://domain.com'
              }
            ],
            'http://schema.org/name': [
              {
                '@value': 'John Doe'
              }
            ],
            'http://schema.org/email': [
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
      const p = [Object.assign({}, model['http://schema.org/provider'][0])];
      model['http://schema.org/provider'][0] = p;
      const result = element._computeProvider(model);
      assert.typeOf(result, 'object');
    });
  });

  describe('_copyPathClipboard()', () => {
    let element;
    let amf;
    before(async () => {
      amf = await AmfLoader.load();
    });

    beforeEach(async () => {
      element = await basicFixture();
      element.amf = amf;
      await aTimeout();
    });

    it('Calls copy() in the `clipboard-copy` element', () => {
      const copy = element.shadowRoot.querySelector('clipboard-copy');
      const spy = sinon.spy(copy, 'copy');
      element._copyPathClipboard();
      assert.isTrue(spy.called);
    });

    it('Changes the icon', () => {
      element._copyPathClipboard();
      const button = element.shadowRoot.querySelector('.copy-icon');
      assert.notEqual(button.icon, 'arc:content-copy');
    });

    it('Changes the icon back', (done) => {
      element._copyPathClipboard();
      setTimeout(() => {
        const button = element.shadowRoot.querySelector('.copy-icon');
        assert.equal(button.icon, 'arc:content-copy');
        done();
      }, 1001);
    });
  });

  describe('raml-aware model', () => {
    let element;
    let amf;
    before(async () => {
      amf = await AmfLoader.load();
    });

    beforeEach(async () => {
      const region = await awareFixture();
      element = region.querySelector('api-summary');
      const aware = region.querySelector('raml-aware');
      aware.api = amf;
      await aTimeout();
    });

    it('passes the amf value', () => {
      assert.typeOf(element.amf, 'array');
    });
  });

  describe('a11y', () => {
    let amf;
    let element;

    before(async () => {
      amf = await AmfLoader.load('loan-microservice.json');
    });

    beforeEach(async () => {
      element = await basicFixture();
      element.amf = amf;
      await aTimeout();
    });

    it('passes accessibility test', async () => {
      await assert.isAccessible(element, {
        ignoredRules: ['color-contrast']
      });
    });
  });
});
