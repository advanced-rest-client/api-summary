import { html } from 'lit-html';
import { ApiDemoPageBase } from '@advanced-rest-client/arc-demo-helper/ApiDemoPage.js';
import '@api-components/raml-aware/raml-aware.js';
import '../api-summary.js';

class ApiDemo extends ApiDemoPageBase {
  constructor() {
    super();
    this.componentName = 'api-summary';
    this._navigationHandler = this._navigationHandler.bind(this);
  }

  _apiListTemplate() {
    return [
      ['google-drive-api', 'Google Drive'],
      ['exchange-experience-api', 'Exchange xAPI'],
      ['demo-api', 'Demo API'],
      ['appian-api', 'Applian API'],
      ['nexmo-sms-api', 'Nexmo SMS API'],
      ['loan-microservice', 'Loan microservice (OAS)'],
      ['mocking-service', 'Lots of methods'],
      ['no-endpoints', 'No endpoints!'],
      ['no-server', 'No server!']
    ].map(
      ([file, label]) => html`
        <paper-item data-src="${file}-compact.json">${label}</paper-item>
      `
    );
  }

  _navigationHandler(e) {
    console.log(e.detail);
  }

  contentTemplate() {
    return html`
      <api-summary aware="model" @api-navigation-selection-changed="${this._navigationHandler}"></api-summary>
    `;
  }
}

const instance = new ApiDemo();
instance.render();
window.__demo = instance;
