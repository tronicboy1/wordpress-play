class HelloWorldWc extends HTMLElement {
  connectedCallback() {
    console.log("wc startup");
    this.innerHTML = "<p>Web COmponents RULE!</p>";
    this.addEventListener("click", console.log);
  }
}

const tagName = "hello-word-wc";

window.customElements.define(tagName, HelloWorldWc);
