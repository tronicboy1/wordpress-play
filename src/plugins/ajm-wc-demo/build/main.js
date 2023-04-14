var h = (t, e, o) => {
  if (!e.has(t))
    throw TypeError("Cannot " + o);
};
var n = (t, e, o) => (h(t, e, "read from private field"), o ? o.call(t) : e.get(t)), l = (t, e, o) => {
  if (e.has(t))
    throw TypeError("Cannot add the same private member more than once");
  e instanceof WeakSet ? e.add(t) : e.set(t, o);
}, s = (t, e, o, d) => (h(t, e, "write to private field"), d ? d.call(t, o) : e.set(t, o), o);
var c, i, r;
class a extends HTMLElement {
  constructor() {
    super();
    /** @type {ShadowRoot} */
    l(this, c, void 0);
    /** @type {Text} */
    l(this, i, void 0);
    /** @type {number} */
    l(this, r, void 0);
    s(this, c, this.attachShadow({ mode: "open" })), s(this, i, document.createTextNode("0")), s(this, r, 0);
  }
  connectedCallback() {
    n(this, c).innerHTML = `
    <style>
      :host {
        background-color: white;
        border: 1px solid white;
        border-radius: 4px;
        display: block;
        padding: 1rem;
        width: 90%;
        max-width: 700px;
        margin: 1rem auto;
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.162);
      }
    </style>
    <h1>Shadow DOM Counter</h1>
    <p>Count: </p>
    `, /** @type {HTMLParagraphElement} */
    n(this, c).querySelector("p").append(n(this, i)), this.addEventListener("click", () => this.handleClick());
  }
  /** @private */
  handleClick() {
    s(this, r, n(this, r) + 1), n(this, i).textContent = String(n(this, r));
  }
}
c = new WeakMap(), i = new WeakMap(), r = new WeakMap();
window.customElements.define("wc-counter", a);
function w(t, e, o) {
  t.registerBlockType("ajm/wc-demo-block", {
    edit: () => {
      const d = o.useBlockProps();
      return e("wc-counter", d, "");
    },
    save: () => e("wc-counter", null, ""),
    title: "Wc Counter",
    category: "widgets",
    icon: "menu"
  });
}
w(window.wp.blocks, window.wp.element.createElement, window.wp.blockEditor);
