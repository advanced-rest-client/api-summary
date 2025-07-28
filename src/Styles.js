import { css } from 'lit-element';

export default css`
  :host {
    display: block;
    color: var(--api-summary-color, inherit);
  }

  .api-title {
    margin: 12px 0;
    font-size: var(--api-summary-title-font-size, 16px);
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
    font-size: var(--api-summary-title-narrow-font-size, 1.2rem);
    margin: 0;
  }

  .url-area {
    display: flex;
    flex-direction: column;
    font-family: var(--arc-font-code-family);

    margin-bottom: 40px;
    margin-top: 20px;
    background-color: var(--code-background-color);
    color: var(--code-color);
    padding: 8px;
    border-radius: var(--api-endpoint-documentation-url-border-radius, 4px);
  }

  .url-label {
    font-size: 0.75rem;
    font-weight: 700;
  }

  .url-value {
    font-size: var(--api-endpoint-documentation-url-font-size, 1.07rem);
    word-break: break-all;
  }

  .method-value {
    text-transform: uppercase;
    white-space: nowrap;
  }

  label.section {
    color: var(--arc-font-subhead-color);
    font-weight: var(--arc-font-subhead-font-weight);
    line-height: var(--arc-font-subhead-line-height);
    /* font-size: 18px; */
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
    margin: var(--api-summary-separator-margin, 40px 0);
  }

  .endpoint-item {
    margin-bottom: 32px;
  }

  .method-label {
    margin-right: 8px;
    margin-bottom: 8px;
    text-decoration: none;
  }

  .method-label-with-icon {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
  }

  .method-label:hover,
  .method-label:focus {
    text-decoration: underline;
  }

  .method-icon {
    display: inline-flex;
    width: 14px;
    height: 14px;
    padding-left: 3px;
    padding-bottom: 2px;
    padding-left: 7px;
  }

  .endpoint-path {
    display: block;
    text-decoration: none;
    cursor: pointer;
    margin-bottom: 4px;
    display: inline-block;
    font-weight: var(--api-summary-endpoint-path-font-weight, 500);
    color: var(--link-color, #0277bd);
    margin: 4px 0;
    word-break: break-all;
  }

  .endpoint-path:hover,
  .endpoint-path:focus {
    text-decoration: underline;
    color: var(--link-color, #0277bd);
  }

  .toc .section {
    margin-bottom: 24px;
  }

  .section {
    font-size: var(--api-summary-section-title-font-size);
  }

  .section.endpoints-title {
    font-weight: var(--arc-font-title-font-weight, 500);
    color: var(--arc-font-title-color);
    font-weight: var(--arc-font-title-font-weight);
    line-height: var(--arc-font-title-line-height);
    font-size: var(--arc-font-title-font-size);
  }

  .endpoint-path-name {
    word-break: break-all;
    margin: 8px 0;
  }

  .servers .servers-label {
    font-size: 14px;
    font-weight: 700;
    margin: 0.8em 0 0.2em 0;
  }

  .server-name {
    color: var(--api-method-documentation-async-server-names-color, #ffffff);
    background-color: var(
      --api-method-documentation-async-server-names-bg-color,
      #506773
    );
    text-align: center;
    font-family: var(
      --api-method-documentation-async-server-names-font,
      Avenir
    );
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    border-radius: 4px;
    border: 1px solid
      var(--api-method-documentation-async-server-names-border-color, #506773);
    padding: 4px;
    margin-right: 10px;
    word-break: auto-phrase;
    max-width: fit-content;
  }

  .without-description {
    margin-bottom: 14px;
  }

  .servers .server-tag {
    display: inline-block;
    border: 1px solid var(--anypoint-color-coreBlue2);
    margin-left: 8px;
    color: var(--anypoint-color-coreBlue2);
    padding: 4px;
    border-radius: var(--api-type-document-trait-border-radius, 3px);
    font-size: var(--api-summary-async-api-server-tag-font-size, 14px);
  }

  .server-description {
    display: block;
    font-size: var(--api-summary-server-description-font-size, 12px);
    font-weight: var(--api-summary-server-description-font-weight, 600);
  }

  .endpoint-header {
    display: flex;
    align-items: flex-start;
  }

  .agent-pill {
    display: flex;
    align-items: center;
    padding: 2px 8px;
    border-radius: 16px;
    background-color: var(--agent-pill-background-color, #e0e0e0);
    color: var(--agent-pill-color, #455a64);
    font-size: 12px;
    margin-left: 8px;
    font-weight: 500;
  }

  .info-icon {
    color: var(--agent-pill-info-icon-color, #757575);
    width: 16px;
    height: 16px;
    margin-left: 8px;
  }
`;
