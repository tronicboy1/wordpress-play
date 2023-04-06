import { CSSResultGroup, LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

export const tagName = "litwc-hello-world";

@customElement(tagName)
export class WcHelloWorld extends LitElement {
  @property() name = "User";

  connectedCallback(): void {
    super.connectedCallback();
  }

  static styles = [
    css`
      :host {
        text-align: center;
      }
    `,
  ];

  render() {
    return html`
      <h1>Hello World from Lit</h1>
      <p>Welcome, ${this.name}.</p>
    `;
  }
}
