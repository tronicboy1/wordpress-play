import { Subject as s, BehaviorSubject as a } from "rxjs";
class c extends s {
  set(e) {
    this.next(e);
  }
}
class i extends a {
  set(e) {
    this.next(e);
  }
}
export {
  c as S,
  i as a
};
