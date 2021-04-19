import { LitElement, TemplateResult, CSSResult } from 'lit-element';
import { AmfHelperMixin } from '@api-components/amf-helper-mixin';

/**
 * `api-summary`
 *
 * A summary view for an API base on AMF data model
 */
export declare class ApiSummary extends AmfHelperMixin(LitElement) {
  get styles(): CSSResult;
  /**
   * A property to set to override AMF's model base URI information.
   * When this property is set, the `endpointUri` property is recalculated.
   * @attribute
   */
  baseUri: string;
  /**
   * API title header level in value range from 1 to 6.
   * This is made for accessibility. It the component is used in a context
   * where headers order matters then this property is to be set to
   * arrange headers in the right order.
   *
   * @default 2
   * @attribute
   */
  titleLevel: string;
  /**
   * A property to hide the table of contents list of endpoints.
   */
  hideToc: boolean;

  _providerName: string;
  _providerEmail: string;
  _providerUrl: string;
  _licenseName: string;
  _licenseUrl: string;
  _endpoints: any[];
  _termsOfService: string;
  _version: string;
  _apiTitle: string;
  _description: string;
  _protocols: string[];

  constructor();

  __amfChanged(): void;

  _processModelChange(): void;

  _webApiChanged(webApi: any): void;

  /**
   * Computes value of `apiTitle` property.
   *
   * @param shape Shape of AMF model.
   * @returns Description if defined.
   */
  _computeApiTitle(shape: any): string|undefined;

  /**
   * Computes value for `version` property
   * @param webApi AMF's WebApi shape
   */
  _computeVersion(webApi: any): string|undefined;

  /**
   * Computes API's URI based on `amf` and `baseUri` property.
   *
   * @param server Server model of AMF API.
   * @param baseUri Current value of `baseUri` property
   * @param protocols List of supported protocols
   * @returns Endpoint's URI
   */
  _computeBaseUri(server: any, baseUri?: string, protocols?: string[]): string;

  /**
   * Computes information about provider of the API.
   *
   * @param webApi WebApi shape
   */
  _computeProvider(webApi: any): any|undefined;

  _computeName(provider: any): string|undefined;

  _computeEmail(provider: any): string|undefined;

  _computeUrl(provider: any): string|undefined;

  _computeToS(webApi: any): string|undefined;

  _computeLicense(webApi: any): any|undefined;

  /**
   * Computes view model for endpoints list.
   * @param webApi Web API model
   */
  _computeEndpoints(webApi: any): any[]|undefined;

  /**
   * Computes a view model for supported operations for an endpoint.
   * @param {any} endpoint Endpoint model.
   * @return {any[]|undefined}
   */
  _endpointOperations(endpoint: any): any[]|undefined;

  _navigateItem(e: Event): void;

  render(): TemplateResult;

  _titleTemplate(): TemplateResult|string;

  _versionTemplate(): TemplateResult|string;

  _descriptionTemplate(): TemplateResult|string;

  /**
   * @return {TemplateResult|String} A template for a server, servers, or no servers
   * whether it's defined in the main API definition or not.
   */
  _serversTemplate(): TemplateResult|string;

  /**
   * @param {any} server Server definition
   * @return {TemplateResult} Template for a server list items when there is more
   * than one server.
   */
  _serverListTemplate(server): TemplateResult;

  /**
   * @param {any} server Server definition
   * @return {TemplateResult} A template for a single server in the main API definition
   */
  _baseUriTemplate(server): TemplateResult;

  _protocolsTemplate(): TemplateResult|string;

  _contactInfoTemplate(): TemplateResult|string;

  _licenseTemplate(): TemplateResult|string;

  _termsOfServiceTemplate(): TemplateResult|string;

  _endpointsTemplate(): TemplateResult|string;

  _endpointTemplate(item): TemplateResult|string;

  _endpointPathTemplate(item): TemplateResult;

  _endpointNameTemplate(item): TemplateResult|string;

  _methodTemplate(item, endpoint): TemplateResult|string;

  _sanitizeHTML(HTML): TemplateResult;
}
