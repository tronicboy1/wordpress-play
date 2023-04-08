import { LitElement, css, html } from "lit";
import { property, state, query } from "lit/decorators.js";
const { Subject, fromEvent, map, mergeMap, sampleTime, switchMap, takeUntil } = rxjs;

export const tagName = "litwc-hello-world";

export class WcHelloWorld extends LitElement {
  @property() name = "User";
  @state() clicks = 0;
  @state() todo?: { title: string; id: number };
  @query("input") private input!: HTMLInputElement;
  private teardown$ = new Subject<void>();

  protected firstUpdated(): void {
    const input$ = fromEvent(this.input, "input");
    input$
      .pipe(
        takeUntil(this.teardown$),
        sampleTime(500),
        map(() => this.input.value.trim()),
        switchMap((input) => fetch(`https://jsonplaceholder.typicode.com/todos/${input}`)),
        mergeMap((result) => result.json())
      )
      .subscribe((todo) => (this.todo = todo));
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.teardown$.next();
  }

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
      <input type="number" />
      ${this.todo
        ? html` <article>
            <h1>${this.todo.title}</h1>
          </article>`
        : ""}
    `;
  }
}

if (!window.customElements.get(tagName)) {
  window.customElements.define(tagName, WcHelloWorld);
}
