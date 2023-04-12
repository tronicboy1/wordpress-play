const { Subject: s, BehaviorSubject: a } = rxjs;
class c extends s {
  set(e) {
    this.next(e);
  }
}
class S extends a {
  set(e) {
    this.next(e);
  }
}
export {
  c as S,
  S as a
};
