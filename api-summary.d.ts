/**
 * DO NOT EDIT
 *
 * This file was automatically generated by
 *   https://github.com/Polymer/tools/tree/master/packages/gen-typescript-declarations
 *
 * To modify these typings, edit the source file(s):
 *   api-summary.js
 */


// tslint:disable:variable-name Describing an API that's defined elsewhere.
// tslint:disable:no-any describes the API as best we are able today

import {PolymerElement} from '@polymer/polymer/polymer-element.js';

import {html} from '@polymer/polymer/lib/utils/html-tag.js';

import {AmfHelperMixin} from '@api-components/amf-helper-mixin/amf-helper-mixin.js';

declare namespace ApiElements {

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
   */
  class ApiSummary extends
    AmfHelperMixin(
    Object) {

    /**
     * `raml-aware` scope property to use.
     */
    aware: string|null|undefined;

    /**
     * Computed value of AMF model of a type of `http://schema.org/WebAPI`
     */
    readonly webApi: object|null;

    /**
     * A property to set to override AMF's model base URI information.
     * When this property is set, the `endpointUri` property is recalculated.
     */
    baseUri: string|null|undefined;

    /**
     * API base URI to display in main URL field.
     * This value is computed when `amfModel` or `baseUri` change.
     */
    readonly apiBaseUri: string|null|undefined;

    /**
     * Computed title of the API
     */
    readonly apiTitle: string|null|undefined;

    /**
     * Computed value of method description from `method` property.
     */
    readonly description: string|null|undefined;

    /**
     * Computed value of the `http://raml.org/vocabularies/http#server`
     * from `amfModel`
     */
    readonly server: object|null|undefined;

    /**
     * Computed API version label
     */
    readonly version: string|null|undefined;

    /**
     * Computed value, true when `version` property is set.
     */
    readonly hasVersion: boolean|null|undefined;

    /**
     * Computed list of protocols.
     */
    readonly protocols: string|null|undefined;

    /**
     * Computed value if `protocols` property is set
     */
    readonly hasProtocols: boolean|null|undefined;

    /**
     * Computed value of OAS provider information.
     */
    readonly provider: object|null|undefined;

    /**
     * Computed value if `provider` property is set
     */
    readonly hasProvider: boolean|null|undefined;

    /**
     * Computed value of OAS provider name
     */
    readonly providerName: string|null|undefined;

    /**
     * Computed value of OAS provider email
     */
    readonly providerEmail: string|null|undefined;

    /**
     * Computed value of OAS provider url
     */
    readonly providerUrl: string|null|undefined;

    /**
     * Computed value of OAS terms of service
     */
    readonly termsOfService: string|null|undefined;

    /**
     * Computed value of OAS license
     */
    readonly license: object|null|undefined;

    /**
     * Computed value if `license` property is set
     */
    readonly hasLicense: boolean|null|undefined;

    /**
     * Computed value of OAS license name
     */
    readonly licenseName: string|null|undefined;

    /**
     * Computed value of OAS license url
     */
    readonly licenseUrl: string|null|undefined;

    /**
     * Computed list of endpoints to render.
     */
    readonly endpoints: any[]|null|undefined;

    /**
     * Computed value, true if `endpoints` property is set and has a value.
     */
    readonly hasEndpoints: object|null;

    /**
     * Computes view model for endpoints list.
     *
     * @param webApi Web API model
     */
    _computeEndpoints(webApi: object|null): Array<object|null>|null|undefined;

    /**
     * Computes value of `apiTitle` property.
     *
     * @param shape Shape of AMF model.
     * @returns Description if defined.
     */
    _computeApiTitle(shape: object|null): String|null|undefined;

    /**
     * Computes value for `version` property
     *
     * @param webApi AMF's WebApi shape
     */
    _computeVersion(webApi: object|null): String|null|undefined;

    /**
     * Computes API's URI based on `amfModel` and `baseUri` property.
     *
     * @param server Server model of AMF API.
     * @param baseUri Current value of `baseUri` property
     * @param protocols List of supported protocols
     * @returns Endpoint's URI
     */
    _computeBaseUri(server: object|null, baseUri: String|null, protocols: Array<String|null>|null): String|null;

    /**
     * Displays array values.
     */
    _displayArray(arr: any): any;

    /**
     * Computes information about provider of the API.
     *
     * @param webApi WebApi shape
     */
    _computeProvider(webApi: object|null): object|null|undefined;
    _computeName(provider: any): any;
    _computeEmail(provider: any): any;
    _computeUrl(provider: any): any;
    _computeToS(webApi: any): any;
    _computeLicense(webApi: any): any;
    _copyPathClipboard(): void;

    /**
     * Computes a view model for supported operations for an endpoint.
     *
     * @param endpoint Endpoint model.
     */
    _endpointOperations(endpoint: object|null): Array<object|null>|unbdefined|null;
    _navigateItem(e: any): void;
  }
}

declare global {

  interface HTMLElementTagNameMap {
    "api-summary": ApiElements.ApiSummary;
  }
}
