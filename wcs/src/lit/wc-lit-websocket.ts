import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { map, scan } from "rxjs";
import { webSocket } from "rxjs/webSocket";
import { observe } from "./lib/observer.directive";

const tagName = "wc-lit-websocket";

@customElement(tagName)
export class WcLitWebsocket extends LitElement {
  private socket$ = webSocket<string>({
    url: "ws://localhost:5200",
    protocol: "echo-protocol",
  });
  private messages$ = this.socket$.pipe(scan((acc, message) => [message, ...acc], [] as string[]));

  private handleSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const message = formData.get("message");
    if (!(message && typeof message === "string")) return;
    this.socket$.next(message);
    form.reset();
  }

  render() {
    return html`<h1>Lit Websocket Demo</h1>
      <ul>
        ${observe(this.messages$.pipe(map((messages) => messages.map((message) => html`<li>${message}</li>`))))}
      </ul>
      <form @submit=${this.handleSubmit}>
        <label for="message">New Message</label>
        <input autofocus type="text" maxlength="255" required name="message" id="message" autocomplete="off" />
        <button type="submit">Send</button>
      </form> `;
  }

  static styles = [
    css`
      :host {
        display: block;
      }
    `,
  ];
}
