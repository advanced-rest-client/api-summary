# DEPRECATED

This component is being deprecated. The code base has been moved to [api-documentation](https://github.com/advanced-rest-client/api-documentation) module. This module will be archived when [PR 37](https://github.com/advanced-rest-client/api-documentation/pull/37) is merged.

-----

A component that renders basic information about an API.
It uses AMF model to render the view.

[![Published on NPM](https://img.shields.io/npm/v/@api-components/api-summary.svg)](https://www.npmjs.com/package/@api-components/api-summary)

[![Tests and publishing](https://github.com/advanced-rest-client/api-summary/actions/workflows/deployment.yml/badge.svg)](https://github.com/advanced-rest-client/api-summary/actions/workflows/deployment.yml)

## Version compatibility

This version only works with AMF model version 2 (AMF parser >= 4.0.0).
For compatibility with previous model version use `3.x.x` version of the component.

## Usage

### Installation

```sh
npm install --save @api-components/api-summary
```

### In an html file

```html
<html>
  <head>
    <script type="module">
      import '@api-components/api-summary/api-summary.js';
    </script>
  </head>
  <body>
    <api-summary></api-summary>
    <script>
    const amf = await getAmfModel();
    document.body.querySelector('api-summary').api = amf;
    window.addEventListener('api-navigation-selection-changed', (e) => {
      console.log(e.detail.selected);
      console.log(e.detail.type);
    });
    </script>
  </body>
</html>
```

### Styling using CSS Shadow Parts

```html
<html>
  <head>
    <script type="module">
      import '@api-components/api-summary/api-summary.js';
    </script>
    <style type="text/css">
      api-summary::part(api-title) {
        font-size: 24px;
      }
    </style>
  </head>
  <body>
    <api-summary exportparts="api-title"></api-summary>
    <script>
    const amf = await getAmfModel();
    document.body.querySelector('api-summary').api = amf;
    window.addEventListener('api-navigation-selection-changed', (e) => {
      console.log(e.detail.selected);
      console.log(e.detail.type);
    });
    </script>
  </body>
</html>
```
For a complete list of parts, check out this [doc](./Styling.md).

### In a LitElement template

```js
import { LitElement, html } from 'lit-element';
import '@api-components/api-summary/api-summary.js';

class SampleElement extends LitElement {
  render() {
    return html`
    <api-summary .api="${this._amfModel}" @api-navigation-selection-changed="${this._navHandler}"></api-summary>
    `;
  }

  _navHandler(e) {
    console.log(e.detail.selected);
    console.log(e.detail.type);
  }
}
customElements.define('sample-element', SampleElement);
```

### In a Polymer 3 element

```js
import {PolymerElement, html} from '@polymer/polymer';
import '@api-components/api-summary/api-summary.js';

class SampleElement extends PolymerElement {
  static get template() {
    return html`
    <api-summary api="[[amfModel]]" on-api-navigation-selection-changed="_navHandler"></api-summary>
    `;
  }

  _navHandler(e) {
    console.log(e.detail.selected);
    console.log(e.detail.type);
  }
}
customElements.define('sample-element', SampleElement);
```

## Development

```sh
git clone https://github.com/advanced-rest-client/api-summary
cd api-summary
npm install
```

### Running the demo locally

```sh
npm start
```

### Running the tests

```sh
npm test
```
