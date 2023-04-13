import { css as d, LitElement as f, html as m } from "lit";
import { property as a, customElement as p } from "lit/decorators.js";
var u = Object.defineProperty, h = Object.getOwnPropertyDescriptor, s = (n, e, t, i) => {
  for (var o = i > 1 ? void 0 : i ? h(e, t) : e, l = n.length - 1, c; l >= 0; l--)
    (c = n[l]) && (o = (i ? c(e, t, o) : c(o)) || o);
  return i && o && u(e, t, o), o;
};
let r = class extends f {
  constructor() {
    super(...arguments), this.docsHint = "Click on the Vite and Lit logos to learn more", this.count = 0;
  }
  render() {
    return m` <slot></slot>
      <div class="card">
        <button @click=${this._onClick} part="button">count is ${this.count}</button>
      </div>
      <p class="read-the-docs">${this.docsHint}</p>`;
  }
  _onClick() {
    this.count++;
  }
};
r.styles = d`
    :host {
      max-width: 1280px;
      margin: 0 auto;
      padding: 2rem;
      text-align: center;
    }

    .logo {
      height: 6em;
      padding: 1.5em;
      will-change: filter;
      transition: filter 300ms;
    }
    .logo:hover {
      filter: drop-shadow(0 0 2em #646cffaa);
    }
    .logo.lit:hover {
      filter: drop-shadow(0 0 2em #325cffaa);
    }

    .card {
      padding: 2em;
    }

    .read-the-docs {
      color: #888;
    }

    h1 {
      font-size: 3.2em;
      line-height: 1.1;
    }

    a {
      font-weight: 500;
      color: #646cff;
      text-decoration: inherit;
    }
    a:hover {
      color: #535bf2;
    }

    button {
      border-radius: 8px;
      border: 1px solid transparent;
      padding: 0.6em 1.2em;
      font-size: 1em;
      font-weight: 500;
      font-family: inherit;
      background-color: #1a1a1a;
      cursor: pointer;
      transition: border-color 0.25s;
    }
    button:hover {
      border-color: #646cff;
    }
    button:focus,
    button:focus-visible {
      outline: 4px auto -webkit-focus-ring-color;
    }

    @media (prefers-color-scheme: light) {
      a:hover {
        color: #747bff;
      }
      button {
        background-color: #f9f9f9;
      }
    }`;
s([
  a()
], r.prototype, "docsHint", 2);
s([
  a({ type: Number })
], r.prototype, "count", 2);
r = s([
  p("my-element")
], r);
function b(n, e) {
  const t = e.createElement;
  n.registerBlockType("create-block/todo-api-block", {
    edit: () => t("my-element", null, ""),
    save: () => t("my-element", null, "Save")
  });
}
b(window.wp.blocks, window.wp.element);
