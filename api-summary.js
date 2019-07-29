import { LitElement, html, css } from 'lit-element';
import { AmfHelperMixin } from '@api-components/amf-helper-mixin/amf-helper-mixin.js';
import markdownStyles from '@advanced-rest-client/markdown-styles/markdown-styles.js';
import labelStyles from '@api-components/http-method-label/http-method-label-common-styles.js';
import '@api-components/raml-aware/raml-aware.js';
import '@advanced-rest-client/arc-marked/arc-marked.js';
import '@polymer/iron-meta/iron-meta.js';
import '@advanced-rest-client/clipboard-copy/clipboard-copy.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@advanced-rest-client/arc-icons/arc-icons.js';
/**
 * `api-summary`
 *
 * A summary view for an API base on AMF data model
 *
 * ## Styling
 *
 * `<api-summary>` provides the following custom properties and mixins for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--api-summary` | Mixin applied to this elment | `{}`
 * `--api-summary-color` | Color of text labels | ``
 * `--api-summary-url-font-size` | Font size of endpoin URL | `16px`
 * `--api-summary-url-background-color` | Background color of the URL section | `#424242`
 * `--api-summary-url-font-color` | Font color of the URL area | `#fff`
 * `--api-summary-separator-color` | Color of section separator | `rgba(0, 0, 0, 0.12)`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 * @memberof ApiElements
 * @appliesMixin AmfHelperMixin
 */
class ApiSummary extends AmfHelperMixin(LitElement) {
  static get styles() {
    return [
      markdownStyles,
      labelStyles,
      css`
        :host {
          display: block;
          color: var(--api-summary-color, inherit);
          font-size: var(--arc-font-body1-font-size, initial);
          font-weight: var(--arc-font-body1-font-weight, initial);
          line-height: var(--arc-font-body1-line-height, initial);
        }

        h1 {
          font-size: var(--arc-font-headline-font-size);
          font-weight: var(--arc-font-headline-font-weight);
          letter-spacing: var(--arc-font-headline-letter-spacing);
          line-height: var(--arc-font-headline-line-height);
        }

        arc-marked {
          padding: 0;
        }

        .marked-description {
          margin: 24px 0;
        }

        .markdown-body {
          margin-bottom: 28px;
        }

        :host([narrow]) h1 {
          font-size: 20px;
          margin: 0;
        }

        .url-area {
          display: flex;
          flex-direction: row;
          align-items: center;
          font-family: var(--arc-font-code-family);
          font-size: var(--api-summary-url-font-size, 16px);
          margin: 40px 0;
          background-color: var(--api-summary-url-background-color, #424242);
          color: var(--api-summary-url-font-color, #fff);
          padding: 8px;
          border-radius: 2px;
        }

        .url-value {
          margin-left: 12px;
          word-break: break-all;
          flex: 1;
          flex-basis: 0.000000001px;
        }

        .method-value {
          text-transform: uppercase;
          white-space: nowrap;
        }

        label.section {
          font-size: var(--arc-font-subhead-font-size);
          font-weight: var(--arc-font-subhead-font-weight);
          line-height: var(--arc-font-subhead-line-height);
          font-size: 18px;
          margin-top: 20px;
          display: block;
        }

        a {
          color: var(--link-color);
        }

        a:hover {
          color: var(--link-hover-color);
        }

        .chip {
          display: inline-block;
          white-space: nowrap;
          padding: 2px 4px;
          margin-right: 8px;
          background-color: var(--api-summary-chip-background-color, #f0f0f0);
          color: var(--api-summary-chip-color, #616161);
          border-radius: var(--api-summary-chip-border-radius, 2px);
        }

        .app-link {
          color: var(--link-color);
        }

        .link-padding {
          margin-left: 8px;
        }

        .inline-description {
          padding: 0;
          margin: 0;
        }

        .docs-section {
          margin-bottom: 40px;
        }

        .separator {
          background-color: var(--api-summary-separator-color, rgba(0, 0, 0, 0.12));
          height: 1px;
          margin: 40px 0;
        }

        .endpoint-item {
          margin-bottom: 32px;
        }

        .method-label {
          margin-right: 8px;
          margin-bottom: 8px;
          cursor: pointer;
        }

        .method-label:hover {
          text-decoration: underline;
        }

        .endpoint-label {
          display: inline-block;
          margin-right: 8px;
          cursor: pointer;
          font-weight: bold;
          text-decoration: underline;
          font-size: 15px;
          color: var(--link-color);
        }

        .endpoint-path {
          text-decoration: underline;
          font-size: 14px;
          cursor: pointer;
          margin-bottom: 4px;
          display: inline-block;
        }

        .toc .section {
          margin-bottom: 24px;
        }
      `
    ];
  }

  render() {
    const { aware, amf, baseUri } = this;
    const webApi = this._computeWebApi(amf);
    const server = this._computeServer(amf);
    const protocols = this._computeProtocols(amf);
    const apiBaseUri = this._computeBaseUri(server, baseUri, protocols);
    const apiTitle = this._computeApiTitle(webApi);
    const description = this._computeDescription(webApi);
    const version = this._computeVersion(webApi);
    const provider = this._computeProvider(webApi);
    const providerName = this._computeName(provider);
    const providerEmail = this._computeEmail(provider);
    const providerUrl = this._computeUrl(provider);
    const termsOfService = this._computeToS(webApi);
    const license = this._computeLicense(webApi);
    const licenseName = this._computeName(license);
    const licenseUrl = this._computeUrl(license);
    const endpoints = this._computeEndpoints(webApi);
    return html`
      ${aware
        ? html`
            <raml-aware @api-changed="${this._apiHandler}" .scope="${aware}"></raml-aware>
          `
        : undefined}
      <div>
        <h1>${apiTitle}</h1>

        ${version
          ? html`
              <p class="inline-description version">
                <label>Version:</label>
                <span>${version}</span>
              </p>
            `
          : undefined}
        ${description
          ? html`
              <div role="region" class="marked-description">
                <arc-marked .markdown="${description}">
                  <div slot="markdown-html" class="markdown-body"></div>
                </arc-marked>
              </div>
            `
          : undefined}
        ${apiBaseUri
          ? html`
              <div class="url-area">
                <div class="url-value">${apiBaseUri}</div>
                <paper-icon-button
                  class="action-icon copy-icon"
                  icon="arc:content-copy"
                  @click="${this._copyPathClipboard}"
                  title="Copy path to clipboard"
                ></paper-icon-button>
              </div>
              <clipboard-copy .content="${apiBaseUri}"></clipboard-copy>
            `
          : undefined}
        ${protocols && protocols.length
          ? html`
              <label class="section">Supported protocols</label>
              <div class="protocol-chips">
                ${protocols.map(
                  (item) =>
                    html`
                      <span class="chip">${item}</span>
                    `
                )}
              </div>
            `
          : undefined}
        ${provider
          ? html`
              <section role="contentinfo" class="docs-section">
                <label class="section">Contact information</label>
                <p class="inline-description">
                  <span class="provider-name">${providerName}</span>
                  ${providerEmail
                    ? html`
                        <a class="app-link link-padding provider-email" href="mailto:${providerEmail}"
                          >${providerEmail}</a
                        >
                      `
                    : undefined}
                </p>
                ${providerUrl
                  ? html`
                      <p class="inline-description">
                        <a href="${providerUrl}" target="_blank" class="app-link provider-url">${providerUrl}</a>
                      </p>
                    `
                  : undefined}
              </section>
            `
          : undefined}
        ${licenseUrl && licenseName
          ? html`
              <section role="region" aria-labelledby="licenseLabel" class="docs-section">
                <label class="section" id="licenseLabel">License</label>
                <p class="inline-description">
                  <a href="${licenseUrl}" target="_blank" class="app-link">${licenseName}</a>
                </p>
              </section>
            `
          : undefined}
        ${termsOfService
          ? html`
              <section role="region" aria-labelledby="tocLabel" class="docs-section">
                <label class="section" id="tocLabel">Terms of service</label>
                <arc-marked .markdown="${termsOfService}">
                  <div slot="markdown-html" class="markdown-body"></div>
                </arc-marked>
              </section>
            `
          : undefined}
      </div>

      ${endpoints && endpoints.length
        ? html`
            <div class="separator"></div>
            <div class="toc">
              <label class="section">API endpoints</label>
              ${endpoints.map(
                (item) => html`
                  <div class="endpoint-item" @click="${this._navigateItem}">
                    <div
                      class="endpoint-path"
                      data-id="${item.id}"
                      data-shape-type="endpoint"
                      title="Open endpoint documentation"
                      role="button"
                      tabindex="0"
                    >
                      ${item.path}
                    </div>
                    <div class="endpoint-header">
                      ${item.name
                        ? html`
                            <span
                              class="endpoint-label"
                              data-id="${item.id}"
                              data-shape-type="endpoint"
                              title="Open endpoint documentation"
                              role="button"
                              tabindex="0"
                              >${item.name}</span
                            >
                          `
                        : undefined}
                      ${item.ops && item.ops.length
                        ? item.ops.map(
                            (item) =>
                              html`
                                <span
                                  class="method-label"
                                  data-method="${item.method}"
                                  data-id="${item.id}"
                                  data-shape-type="method"
                                  title="Open method documentation"
                                  role="button"
                                  tabindex="0"
                                  >${item.method}</span
                                >
                              `
                          )
                        : undefined}
                    </div>
                  </div>
                `
              )}
            </div>
          `
        : undefined}
    `;
  }

  static get properties() {
    return {
      /**
       * `raml-aware` scope property to use.
       */
      aware: { type: String },
      /**
       * A property to set to override AMF's model base URI information.
       * When this property is set, the `endpointUri` property is recalculated.
       */
      baseUri: { type: String, value: '' }
    };
  }
  /**
   * Computes value of `apiTitle` property.
   *
   * @param {Object} shape Shape of AMF model.
   * @return {String|undefined} Description if defined.
   */
  _computeApiTitle(shape) {
    return this._getValue(shape, this.ns.schema.schemaName);
  }
  /**
   * Computes value for `version` property
   * @param {Object} webApi AMF's WebApi shape
   * @return {String|undefined}
   */
  _computeVersion(webApi) {
    return this._getValue(webApi, this.ns.schema.name + 'version');
  }
  /**
   * Computes API's URI based on `amf` and `baseUri` property.
   *
   * @param {Object} server Server model of AMF API.
   * @param {?String} baseUri Current value of `baseUri` property
   * @param {?Array<String>} protocols List of supported protocols
   * @return {String} Endpoint's URI
   */
  _computeBaseUri(server, baseUri, protocols) {
    let base = this._getBaseUri(baseUri, server, protocols);
    if (base && base[base.length - 1] === '/') {
      base = base.substr(0, base.length - 1);
    }
    return base;
  }
  /**
   * Computes information about provider of the API.
   *
   * @param {Object} webApi WebApi shape
   * @return {Object|undefined}
   */
  _computeProvider(webApi) {
    if (!webApi) {
      return;
    }
    const key = this._getAmfKey(this.ns.schema.name + 'provider');
    let data = this._ensureArray(webApi[key]);
    if (!data) {
      return;
    }
    data = data[0];
    if (data instanceof Array) {
      data = data[0];
    }
    return data;
  }

  _computeName(provider) {
    return this._getValue(provider, this.ns.schema.schemaName);
  }

  _computeEmail(provider) {
    return this._getValue(provider, this.ns.schema.name + 'email');
  }

  _computeUrl(provider) {
    let value = this._getValue(provider, this.ns.schema.name + 'url');
    if (!value && provider) {
      const key = this._getAmfKey(this.ns.schema.name + 'url');
      const data = provider[key];
      if (data) {
        value = data instanceof Array ? data[0]['@id'] : data['@id'];
      }
    }
    return value;
  }

  _computeToS(webApi) {
    return this._getValue(webApi, this.ns.schema.name + 'termsOfService');
  }

  _computeLicense(webApi) {
    const key = this._getAmfKey(this.ns.schema.name + 'license');
    const data = webApi && webApi[key];
    if (!data) {
      return;
    }
    return data instanceof Array ? data[0] : data;
  }

  _copyPathClipboard() {
    const button = this.shadowRoot.querySelector('.copy-icon');
    const node = this.shadowRoot.querySelector('clipboard-copy');
    if (node.copy()) {
      button.icon = 'arc:done';
    } else {
      button.icon = 'arc:error';
    }
    setTimeout(() => {
      button.icon = 'arc:content-copy';
    }, 1000);
  }
  /**
   * Computes view model for endpoints list.
   * @param {Object} webApi Web API model
   * @return {Array<Object>|undefined}
   */
  _computeEndpoints(webApi) {
    if (!webApi) {
      return;
    }
    const key = this._getAmfKey(this.ns.raml.vocabularies.http + 'endpoint');
    const endpoints = this._ensureArray(webApi[key]);
    if (!endpoints || !endpoints.length) {
      return;
    }
    return endpoints.map((item) => {
      const result = {
        name: this._getValue(item, this.ns.schema.schemaName),
        path: this._getValue(item, this.ns.raml.vocabularies.http + 'path'),
        id: item['@id'],
        ops: this._endpointOperations(item)
      };
      return result;
    });
  }
  /**
   * Computes a view model for supported operations for an endpoint.
   * @param {Object} endpoint Endpoint model.
   * @return {Array<Object>|unbdefined}
   */
  _endpointOperations(endpoint) {
    const key = this._getAmfKey(this.ns.w3.hydra.core + 'supportedOperation');
    const so = this._ensureArray(endpoint[key]);
    if (!so || !so.length) {
      return;
    }
    return so.map((item) => {
      return {
        id: item['@id'],
        method: this._getValue(item, this.ns.w3.hydra.core + 'method')
      };
    });
  }

  _navigateItem(e) {
    const data = e.composedPath()[0].dataset;
    if (!data.id || !data.shapeType) {
      return;
    }
    const ev = new CustomEvent('api-navigation-selection-changed', {
      bubbles: true,
      composed: true,
      detail: {
        selected: data.id,
        type: data.shapeType
      }
    });
    this.dispatchEvent(ev);
  }

  _apiHandler(e) {
    this.amf = e.target.api;
  }
}
window.customElements.define('api-summary', ApiSummary);
