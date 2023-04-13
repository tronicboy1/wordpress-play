import { buffer as f, debounceTime as p, filter as t, map as o } from "rxjs";
function n(r = 250) {
  return (i) => i.pipe(f(i.pipe(p(r))), t((e) => e.length > 1), o(([e]) => e));
}
export {
  n as f
};
