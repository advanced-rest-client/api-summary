import { html } from 'lit-html';
import { ApiDemoPage } from '@advanced-rest-client/arc-demo-helper';
import '@advanced-rest-client/arc-demo-helper/arc-interactive-demo.js';
import '../api-summary.js';

class ApiDemo extends ApiDemoPage {
  constructor() {
    super();
    this.componentName = 'api-summary';
    this.renderViewControls = true;
    this.noApiNativation = true;
  }

  _apiListTemplate() {
    return [
      ["google-drive-api", "Google Drive"],
      ["exchange-experience-api", "Exchange xAPI"],
      ["demo-api", "Demo API"],
      ["appian-api", "Applian API"],
      ["nexmo-sms-api", "Nexmo SMS API"],
      ["loan-microservice", "Loan microservice (OAS)"],
      ["prevent-xss", "Prevent XSS"],
      ["mocking-service", "Lots of methods"],
      ["no-endpoints", "No endpoints!"],
      ["no-server", "No server!"],
      ["multiple-servers", "Multiple servers"],
      ["async-api", "AsyncAPI"],
      ["APIC-641", "APIC-641"],
      ["W-10881270", "W-10881270"],
      ["async-api26", "AsyncAPI26"],
      ["asyncApi-2.62", "AsyncAPI26-2"],
    ].map(
      ([file, label]) => html`
        <anypoint-item data-src="${file}-compact.json">${label}</anypoint-item>
      `
    );
  }

  _navigationHandler(e) {
    console.log(e.detail);
  }

  _demoTemplate() {
    const {
      demoStates,
      darkThemeActive,
      compatibility,
      amf,
    } = this;
    return html `
    <section class="documentation-section">
      <h3>Interactive demo</h3>
      <p>
        This demo lets you preview the API summary element with various
        configuration options.
      </p>

      <arc-interactive-demo
        .states="${demoStates}"
        @state-chanegd="${this._demoStateHandler}"
        ?dark="${darkThemeActive}"
      >
        <api-summary
          .amf="${amf}"
          ?compatibility="${compatibility}"
          @api-navigation-selection-changed="${this._navigationHandler}"
          slot="content"
        ></api-summary>
      </arc-interactive-demo>
    </section>`;
  }

  _introductionTemplate() {
    return html `
      <section class="documentation-section">
        <h3>Introduction</h3>
        <p>
          A web component to render a summary page of an API. The view is rendered
          using AMF data model.
        </p>
      </section>
    `;
  }

  _usageTemplate() {
    return html `
      <section class="documentation-section">
        <h2>Usage</h2>
        <p>API summary comes with 2 predefied styles:</p>
        <ul>
          <li><b>Material Design</b> (default)</li>
          <li>
            <b>Compatibility</b> - To provide compatibility with Anypoint design, use
            <code>compatibility</code> property
          </li>
        </ul>
      </section>`;
  }

  contentTemplate() {
    return html`
    <h2 class="centered main">API summary</h2>
    ${this._demoTemplate()}
    ${this._introductionTemplate()}
    ${this._usageTemplate()}
    `;
  }
}

const instance = new ApiDemo();
instance.render();
window.__demo = instance;
