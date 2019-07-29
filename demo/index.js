import { html } from 'lit-html';
import { ApiDemoPageBase } from '@advanced-rest-client/arc-demo-helper/ApiDemoPage.js';
import '@advanced-rest-client/arc-demo-helper/arc-demo-helper';
import '@api-components/raml-aware/raml-aware.js';
import '../api-summary.js';

class ApiDemo extends ApiDemoPageBase {
  constructor() {
    super();
  }

  _apiListTemplate() {
    return html`
      <paper-item data-src="demo-api.json">Demo api</paper-item>
      <paper-item data-src="demo-api-compact.json">Demo api - compact version</paper-item>
      <paper-item data-src="array-body.json">Body with array</paper-item>
      <paper-item data-src="array-body-compact.json">Body with array - compact version</paper-item>
      <paper-item data-src="nexmo-sms-api.json">Nexmo SMS API</paper-item>
      <paper-item data-src="nexmo-sms-api-compact.json">Nexmo SMS API - compact version</paper-item>
      <paper-item data-src="appian-api.json">Appian API</paper-item>
      <paper-item data-src="appian-api-compact.json">Appian API - compact version</paper-item>
      <paper-item data-src="loan-microservice.json">Loan microservice</paper-item>
      <paper-item data-src="loan-microservice-compact.json">Loan microservice - compact version</paper-item>
      <paper-item data-src="mocking-service.json">mocking-service</paper-item>
      <paper-item data-src="mocking-service-compact.json">mocking-service - compact</paper-item>
      <paper-item data-src="no-endpoints.json">no-endpoints</paper-item>
      <paper-item data-src="no-endpoints-compact.json">no-endpoints - compact</paper-item>
      <paper-item data-src="no-server.json">No server info</paper-item>
      <paper-item data-src="no-server-compact.json">No server info - compact</paper-item>
    `;
  }

  contentTemplate() {
    return html`
      <api-summary aware="model"></api-summary>
    `;
  }
}

const instance = new ApiDemo();
instance.render();
window.__demo = instance;
