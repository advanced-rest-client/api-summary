import { assert, fixture, html, aTimeout } from '@open-wc/testing';
import { AmfLoader } from './amf-loader.js';
import '../api-summary.js';

describe('AsyncAPI 3.0 operation rendering (summary)', () => {
  let element;
  before(async () => {
    const amf = await AmfLoader.load(true, 'async30'); // (compact, fileName)
    element = await fixture(html`<api-summary .amf="${amf}"></api-summary>`);
    await aTimeout(0);
  });

  it('labels the async op SEND (not POST)', () => {
    const labels = Array.from(element.shadowRoot.querySelectorAll('.method-label'))
      .map((n) => n.textContent.trim().toLowerCase());
    assert.include(labels, 'send');
    assert.notInclude(labels, 'post');
  });

  it('colors the SEND badge as publish', () => {
    const badge = Array.from(element.shadowRoot.querySelectorAll('.method-label'))
      .find((n) => n.textContent.trim().toLowerCase() === 'send');
    assert.exists(badge, 'no SEND badge rendered');
    assert.equal(badge.getAttribute('data-method'), 'publish');
  });
});
