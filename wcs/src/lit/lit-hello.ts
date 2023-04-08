import { LitElement, css, html } from "lit";
import { property, state } from "lit/decorators.js";

export const tagName = "litwc-hello-world";

export class WcHelloWorld extends LitElement {
  @property() name = "User";
  @state() clicks = 0;

  static styles = [
    css`
      :host {
        text-align: center;
      }
    `,
  ];

  handleClick() {
    this.clicks = this.clicks += 1;
  }

  render() {
    return html`
      <h1 @click=${this.handleClick}>Hello World from Lit</h1>
      <p>Welcome, ${this.name}.</p>
      <p>Clicks: ${this.clicks}</p>
    `;
  }
}

if (!window.customElements.get(tagName)) {
  window.customElements.define(tagName, WcHelloWorld);
}
