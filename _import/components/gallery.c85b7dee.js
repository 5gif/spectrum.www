import { Fragment, jsx } from "../../_npm/react@18.3.1/jsx-runtime.e4a2bff6.js";
import * as d3 from "../../_npm/d3@7.9.0/7055d4c5.js";
export function Collage({ imgs, clickevent }) {
  return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("img", { loading: "lazy", src: imgs, onClick: clickevent, alt: "img" }) });
}
;
export function Gallery({ listarray, clickevent }) {
  var result = d3.map(listarray, (i) => /* @__PURE__ */ jsx(Collage, { imgs: i }));
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx("div", { id: "gallery", children: d3.map(listarray, (i) => /* @__PURE__ */ jsx(Collage, { imgs: i, clickevent })) }) });
}
