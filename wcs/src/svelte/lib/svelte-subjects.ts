const { Subject } = rxjs;

export class SvelteSubject<T> extends Subject<T> {
  set(val: T) {
    this.next(val);
  }
}
