import { directive as s } from "lit/directive.js";
import { AsyncDirective as t } from "lit/async-directive.js";
import { noChange as i } from "lit";
const { Subject: n, takeUntil: c } = rxjs;
class o extends t {
  constructor() {
    super(...arguments), this.disconnected$ = new n();
  }
  render(e) {
    return this.source = e.pipe(c(this.disconnected$)), this.subscribe(), i;
  }
  disconnected() {
    this.disconnected$.next();
  }
  reconnected() {
    this.subscribe();
  }
  subscribe() {
    this.isConnected && this.source.subscribe({
      next: (e) => this.setValue(e),
      error: (e) => console.error(e)
    });
  }
}
function h(r) {
  return s(o)(r);
}
export {
  h as o
};
