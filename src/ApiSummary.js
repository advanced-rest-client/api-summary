/* eslint-disable lit-a11y/click-events-have-key-events */
/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
import { LitElement, html } from "lit-element";
import { unsafeHTML } from "lit-html/directives/unsafe-html.js";
import { AmfHelperMixin } from "@api-components/amf-helper-mixin";
import markdownStyles from "@advanced-rest-client/markdown-styles/markdown-styles.js";
import labelStyles from "@api-components/http-method-label/http-method-label-common-styles.js";
import sanitizer from "dompurify";
import "@advanced-rest-client/arc-marked/arc-marked.js";
import "@api-components/api-method-documentation/api-url.js";
import styles from "./Styles.js";

/** @typedef {import('lit-element').TemplateResult} TemplateResult */

/**
 * `api-summary`
 *
 * A summary view for an API base on AMF data model
 */
export class ApiSummary extends AmfHelperMixin(LitElement) {
  get styles() {
    return [markdownStyles, labelStyles, styles];
  }

  static get properties() {
    return {
      /**
       * A property to set to override AMF's model base URI information.
       * When this property is set, the `endpointUri` property is recalculated.
       */
      baseUri: { type: String },
      /**
       * API title header level in value range from 1 to 6.
       * This is made for accessibility. It the component is used in a context
       * where headers order matters then this property is to be set to
       * arrange headers in the right order.
       *
       * @default 2
       */
      titleLevel: { type: String },
      /**
       * A property to hide the table of contents list of endpoints.
       */
      hideToc: { type: Boolean },

      _providerName: { type: String },
      _providerEmail: { type: String },
      _providerUrl: { type: String },
      _licenseName: { type: String },
      _licenseUrl: { type: String },
      _endpoints: { type: Array },
      _termsOfService: { type: String },
      _version: { type: String },
      _apiTitle: { type: String },
      _description: { type: String },
      _protocols: { type: Array },
    };
  }

  // get baseUri() {
  //   return this._baseUri;
  // }
  //
  // set baseUri(value) {
  //   const old = this._baseUri;
  //   /* istanbul ignore if */
  //   if (old === value) {
  //     return;
  //   }
  //   this._baseUri = value;
  //   // this._apiBaseUri = this._computeBaseUri(this.server, value, this.protocols);
  //   this.requestUpdate('baseUri', old);
  // }

  // get _protocols() {
  //   return this.__protocols;
  // }
  //
  // set _protocols(value) {
  //   const old = this.__protocols;
  //   /* istanbul ignore if */
  //   if (old === value) {
  //     return;
  //   }
  //   this.__protocols = value;
  //   this._apiBaseUri = this._computeBaseUri(this.server, this.baseUri, value);
  //   this.requestUpdate('_protocols', old);
  // }

  constructor() {
    super();
    this.titleLevel = 2;
    /**
     * @type {string}
     */
    this.baseUri = undefined;
    /**
     * @type {string[]}
     */
    this.protocols = undefined;
    this.hideToc = false;
  }

  __amfChanged() {
    if (this.__amfProcessingDebouncer) {
      return;
    }
    this.__amfProcessingDebouncer = true;
    setTimeout(() => this._processModelChange());
  }

  _processModelChange() {
    this.__amfProcessingDebouncer = false;
    const { amf } = this;
    if (!amf) {
      return;
    }

    this.servers = this._getServers({});
    const webApi = this._computeApi(amf);
    this.webApi = webApi;
    this._protocols = this._computeProtocols(amf);

    this._webApiChanged(webApi);
  }

  _webApiChanged(webApi) {
    if (!webApi) {
      this._apiTitle = undefined;
      this._description = undefined;
      this._version = undefined;
      this._termsOfService = undefined;
      this._endpoints = undefined;

      this._providerName = undefined;
      this._providerEmail = undefined;
      this._providerUrl = undefined;

      this._licenseName = undefined;
      this._licenseUrl = undefined;
      return;
    }

    this._apiTitle = this._computeApiTitle(webApi);
    this._description = this._computeDescription(webApi);
    this._version = this._computeVersion(webApi);
    this._termsOfService = this._computeToS(webApi);
    this._endpoints = this._computeEndpoints(webApi);

    const provider = this._computeProvider(webApi);
    this._providerName = this._computeName(provider);
    this._providerEmail = this._computeEmail(provider);
    this._providerUrl = this._computeUrl(provider);

    const license = this._computeLicense(webApi);
    this._licenseName = this._computeName(license);
    this._licenseUrl = this._computeUrl(license);
  }

  /**
   * Computes value of `apiTitle` property.
   *
   * @param {any} shape Shape of AMF model.
   * @return {string|undefined} Description if defined.
   */
  _computeApiTitle(shape) {
    return /** @type string */ (
      this._getValue(shape, this.ns.aml.vocabularies.core.name)
    );
  }

  /**
   * Computes value for `version` property
   * @param {any} webApi AMF's WebApi shape
   * @return {string|undefined}
   */
  _computeVersion(webApi) {
    return /** @type string */ (
      this._getValue(webApi, this.ns.aml.vocabularies.core.version)
    );
  }

  /**
   * Computes API's URI based on `amf` and `baseUri` property.
   *
   * @param {any} server Server model of AMF API.
   * @param {string=} baseUri Current value of `baseUri` property
   * @param {string[]=} protocols List of supported protocols
   * @return {string} Endpoint's URI
   */
  _computeBaseUri(server, baseUri, protocols) {
    if (!protocols) {
      const protocol = /** @type string */ (
        this._getValue(
          server,
          this._getAmfKey(this.ns.aml.vocabularies.apiContract.protocol)
        )
      );
      if (protocol) {
        protocols = [protocol];
      }
    }
    let base = this._getBaseUri(baseUri, server, protocols);
    if (base && base[base.length - 1] === "/") {
      base = base.substr(0, base.length - 1);
    }
    return base;
  }

  /**
   * Computes information about provider of the API.
   *
   * @param {any} webApi WebApi shape
   * @return {any|undefined}
   */
  _computeProvider(webApi) {
    if (!webApi) {
      return undefined;
    }
    const key = this._getAmfKey(this.ns.aml.vocabularies.core.provider);
    let data = this._ensureArray(webApi[key]);
    if (!data) {
      return undefined;
    }
    [data] = data;
    if (Array.isArray(data)) {
      [data] = data;
    }
    return data;
  }

  _computeName(provider) {
    return this._getValue(provider, this.ns.aml.vocabularies.core.name);
  }

  _computeEmail(provider) {
    return this._getValue(provider, this.ns.aml.vocabularies.core.email);
  }

  _computeUrl(provider) {
    let value = this._getValue(provider, this.ns.aml.vocabularies.core.url);
    if (!value && provider) {
      const key = this._getAmfKey(this.ns.aml.vocabularies.core.url);
      const data = provider[key];
      if (data) {
        value = data instanceof Array ? data[0]["@id"] : data["@id"];
      }
    }
    return value;
  }

  /**
   * @param {any} webApi
   * @returns {string|undefined}
   */
  _computeToS(webApi) {
    return /** @type string */ (
      this._getValue(webApi, this.ns.aml.vocabularies.core.termsOfService)
    );
  }

  /**
   * @param {any} webApi
   * @returns {any}
   */
  _computeLicense(webApi) {
    const key = this._getAmfKey(this.ns.aml.vocabularies.core.license);
    const data = webApi && webApi[key];
    if (!data) {
      return undefined;
    }
    return data instanceof Array ? data[0] : data;
  }

  /**
   * Computes view model for endpoints list.
   * @param {any} webApi Web API model
   * @return {any[]|undefined}
   */
  _computeEndpoints(webApi) {
    if (!webApi) {
      return undefined;
    }
    const key = this._getAmfKey(this.ns.aml.vocabularies.apiContract.endpoint);
    const endpoints = this._ensureArray(webApi[key]);
    if (!endpoints || !endpoints.length) {
      return undefined;
    }
    return endpoints.map((item) => {
      const result = {
        name: this._getValue(item, this.ns.aml.vocabularies.core.name),
        path: this._getValue(item, this.ns.aml.vocabularies.apiContract.path),
        id: item["@id"],
        ops: this._endpointOperations(item),
      };
      return result;
    });
  }

  /**
   * Computes a view model for supported operations for an endpoint.
   * @param {any} endpoint Endpoint model.
   * @return {any[]|undefined}
   */
  _endpointOperations(endpoint) {
    const key = this._getAmfKey(
      this.ns.aml.vocabularies.apiContract.supportedOperation
    );
    const so = this._ensureArray(endpoint[key]);
    if (!so || !so.length) {
      return undefined;
    }
    return so.map((item) => ({
      id: item["@id"],
      method: this._getValue(item, this.ns.aml.vocabularies.apiContract.method),
    }));
  }

  _navigateItem(e) {
    e.preventDefault();
    const data = e.composedPath()[0].dataset;
    if (!data.id || !data.shapeType) {
      return;
    }
    const ev = new CustomEvent("api-navigation-selection-changed", {
      bubbles: true,
      composed: true,
      detail: {
        selected: data.id,
        type: data.shapeType,
      },
    });
    this.dispatchEvent(ev);
  }

  render() {
    return html`<style>
        ${this.styles}
      </style>
      <div>
        ${this._titleTemplate()} ${this._versionTemplate()}
        ${this._descriptionTemplate()} ${this._serversTemplate()}
        ${this._protocolsTemplate()} ${this._contactInfoTemplate()}
        ${this._licenseTemplate()} ${this._termsOfServiceTemplate()}
      </div>

      ${this.hideToc ? "" : this._endpointsTemplate()} `;
  }

  _titleTemplate() {
    const { _apiTitle, titleLevel } = this;
    if (!_apiTitle) {
      return "";
    }
    return html` <div
      class="api-title"
      role="heading"
      aria-level="${titleLevel}"
      part="api-title"
    >
      <label part="api-title-label">API title:</label>
      <span>${_apiTitle}</span>
    </div>`;
  }

  _versionTemplate() {
    const { _version } = this;
    if (!_version) {
      return "";
    }
    return html` <p class="inline-description version" part="api-version">
      <label>Version:</label>
      <span>${_version}</span>
    </p>`;
  }

  _descriptionTemplate() {
    const { _description } = this;
    if (!_description) {
      return "";
    }
    return html` <div
      role="region"
      class="marked-description"
      part="marked-description"
    >
      <arc-marked .markdown="${_description}" sanitize>
        <div slot="markdown-html" class="markdown-body"></div>
      </arc-marked>
    </div>`;
  }

  /**
   * @return {TemplateResult|String} A template for a server, servers, or no servers
   * whether it's defined in the main API definition or not.
   */
  _serversTemplate() {
    const { servers, amf } = this;
    if (!servers || !servers.length) {
      return "";
    }
    if (servers.length === 1 && !this._isAsyncAPI(amf)) {
      return this._baseUriTemplate(servers[0]);
    }

    return html` <div class="servers" slot="markdown-html">
      <p class="servers-label">API servers</p>
      <ul class="server-lists">
        ${servers.map((server) => this._serverListTemplate(server))}
      </ul>
    </div>`;
  }

  /**
   * @param {any} server Server definition
   * @return {TemplateResult} Template for a server list items when there is more
   * than one server.
   */
  _serverListTemplate(server) {
    const { baseUri, protocols } = this;
    const uri = this._computeBaseUri(server, baseUri, protocols);
    const description = this._computeDescription(server);
    const serverNameTemplate = this._serverNameTemplate(server);
    const serverTagsTemplate = this._serverTagsTemplate(server);
    const listItemClass = description ? "" : "without-description";
    return html`<li class="server-item ${listItemClass}">
      ${serverNameTemplate} ${uri} ${serverTagsTemplate}
      <arc-marked
        .markdown=${description}
        class="server-description"
        sanitize
      ></arc-marked>
    </li>`;
  }

  /**
   * @param {any} server Server definition
   * @return {TemplateResult} Template for server tags
   */
  _serverTagsTemplate(server) {
    const isAsyncApi = this._isAsyncAPI(this.amf);
    if (!isAsyncApi) {
      return html``;
    }
    const tagsKey = this._getAmfKey(this.ns.aml.vocabularies.apiContract.tags);
    const tags = server[tagsKey];
    const tagsNames = tags?.map(
      (tagName) =>
        `#${this._getValue(tagName, this.ns.aml.vocabularies.core.name)} `
    );
    return tagsNames?.map(
      (tagName) => html`<p class="server-tag">${tagName}</p>`
    );
  }

  /**
   * @param {any} server Server definition
   * @return {TemplateResult} Template for server name
   */
  _serverNameTemplate(server) {
    const isAsyncApi = this._isAsyncAPI(this.amf);
    if (!isAsyncApi) {
      return html``;
    }
    const serverName = this._getValue(
      server,
      this._getAmfKey(this.ns.aml.vocabularies.core.name)
    );

    return html`<span class="server-name">${serverName}</span>`;
  }

  /**
   * @param {any} server Server definition
   * @return {TemplateResult} A template for a single server in the main API definition
   */
  _baseUriTemplate(server) {
    const { baseUri, protocols, amf } = this;
    const uri = this._computeBaseUri(server, baseUri, protocols);
    return html` <api-url
      .amf="${amf}"
      .baseUri="${uri}"
      .server="${server}"
    ></api-url>`;
  }

  _protocolsTemplate() {
    const { _protocols } = this;
    if (!_protocols || !_protocols.length) {
      return "";
    }
    const result = _protocols.map(
      (item) => html`<span class="chip">${item}</span>`
    );

    return html` <label class="section">Supported protocols</label>
      <div class="protocol-chips">${result}</div>`;
  }

  _contactInfoTemplate() {
    const { _providerName, _providerEmail, _providerUrl } = this;
    if (!_providerName) {
      return "";
    }
    const link = _providerUrl
      ? this._sanitizeHTML(
          `<a href="${_providerUrl}" target="_blank" class="app-link provider-url">${_providerUrl}</a>`
        )
      : undefined;
    return html` <section
      role="contentinfo"
      class="docs-section"
      part="info-section"
    >
      <label class="section">Contact information</label>
      <p class="inline-description" part="info-inline-desc">
        <span class="provider-name">${_providerName}</span>
        ${_providerEmail
          ? html`<a
              class="app-link link-padding provider-email"
              href="mailto:${_providerEmail}"
              >${_providerEmail}</a
            >`
          : ""}
      </p>
      ${_providerUrl
        ? html` <p class="inline-description" part="info-inline-desc">
            ${unsafeHTML(link)}
          </p>`
        : ""}
    </section>`;
  }

  _licenseTemplate() {
    const { _licenseUrl, _licenseName } = this;
    if (!_licenseUrl || !_licenseName) {
      return "";
    }
    const link = this._sanitizeHTML(
      `<a href="${_licenseUrl}" target="_blank" class="app-link">${_licenseName}</a>`
    );
    return html` <section
      aria-labelledby="licenseLabel"
      class="docs-section"
      part="license-section"
    >
      <label class="section" id="licenseLabel">License</label>
      <p class="inline-description">${unsafeHTML(link)}</p>
    </section>`;
  }

  _termsOfServiceTemplate() {
    const { _termsOfService } = this;
    if (!_termsOfService || !_termsOfService.length) {
      return "";
    }
    return html` <section aria-labelledby="tocLabel" class="docs-section">
      <label class="section" id="tocLabel">Terms of service</label>
      <arc-marked .markdown="${_termsOfService}" sanitize>
        <div slot="markdown-html" class="markdown-body"></div>
      </arc-marked>
    </section>`;
  }

  _endpointsTemplate() {
    const { _endpoints } = this;
    if (!_endpoints || !_endpoints.length) {
      return "";
    }
    const result = _endpoints.map((item) => this._endpointTemplate(item));
    const pathLabel = this._isAsyncAPI(this.amf) ? "channels" : "endpoints";
    return html`
      <div class="separator" part="separator"></div>
      <div class="toc" part="toc">
        <label class="section endpoints-title">API ${pathLabel}</label>
        ${result}
      </div>
    `;
  }

  _endpointTemplate(item) {
    const ops =
      item.ops && item.ops.length
        ? item.ops.map((op) => this._methodTemplate(op, item))
        : "";
    return html` <div class="endpoint-item" @click="${this._navigateItem}">
      ${item.name
        ? this._endpointNameTemplate(item)
        : this._endpointPathTemplate(item)}
      <div class="endpoint-header">${ops}</div>
    </div>`;
  }

  _endpointPathTemplate(item) {
    return html`
      <a
        class="endpoint-path"
        href="#${item.path}"
        data-id="${item.id}"
        data-shape-type="endpoint"
        title="Open endpoint documentation"
        >${item.path}</a
      >
    `;
  }

  _endpointNameTemplate(item) {
    if (!item.name) {
      return "";
    }
    return html`
      <a
        class="endpoint-path"
        href="#${item.path}"
        data-id="${item.id}"
        data-shape-type="endpoint"
        title="Open endpoint documentation"
        >${item.name}</a
      >
      <p class="endpoint-path-name">${item.path}</p>
    `;
  }

  _methodTemplate(item, endpoint) {
    return html`
      <a
        href="#${`${endpoint.path}/${item.method}`}"
        class="method-label"
        data-method="${item.method}"
        data-id="${item.id}"
        data-shape-type="method"
        title="Open method documentation"
        >${item.method}</a
      >
    `;
  }

  /**
   * @param {string} HTML
   * @returns {string}
   */
  _sanitizeHTML(HTML) {
    const result = sanitizer.sanitize(HTML, {
      ADD_ATTR: ["target", "href"],
      ALLOWED_TAGS: ["a"],
      USE_PROFILES: { html: true },
    });

    if (typeof result === "string") {
      return result;
    }

    // @ts-ignore
    return result.toString();
  }
}
