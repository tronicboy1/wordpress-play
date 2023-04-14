class WcCounter extends HTMLElement {
  /** @type {ShadowRoot} */
  #root;
  /** @type {Text} */
  #countTextRef;
  /** @type {number} */
  #count;

  constructor() {
    super();
    this.#root = this.attachShadow({ mode: "open" });
    this.#countTextRef = document.createTextNode("0");
    this.#count = 0;
  }

  connectedCallback() {
    this.#root.innerHTML = `
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
    `;
    const p = /** @type {HTMLParagraphElement} */ (this.#root.querySelector("p"));
    p.append(this.#countTextRef);
    this.addEventListener("click", () => this.handleClick());
  }

  /** @private */
  handleClick() {
    this.#count += 1;
    this.#countTextRef.textContent = String(this.#count);
  }
}

window.customElements.define("wc-counter", WcCounter);
