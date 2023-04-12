const { Subject, BehaviorSubject } = rxjs;

export class SvelteSubject<T> extends Subject<T> {
  set(val: T) {
    this.next(val);
  }
}

export class SvBehaviorSubject<T> extends BehaviorSubject<T> {
  set(val: T) {
    this.next(val);
  }
}
