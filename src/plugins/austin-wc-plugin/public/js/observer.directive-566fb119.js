import { directive as t } from "lit/directive.js";
import { AsyncDirective as s } from "lit/async-directive.js";
import { Subject as i, takeUntil as n } from "rxjs";
import { noChange as c } from "lit";
class o extends s {
  constructor() {
    super(...arguments), this.disconnected$ = new i();
  }
  render(e) {
    return this.source = e.pipe(n(this.disconnected$)), this.subscribe(), c;
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
function m(r) {
  return t(o)(r);
}
export {
  m as o
};
