import{r as t,g as e,R as n}from"./vendor-2558aff9.js";const r=t=>{let e;const n=new Set,r=(t,r)=>{const u="function"==typeof t?t(e):t;if(!Object.is(u,e)){const t=e;e=(null!=r?r:"object"!=typeof u||null===u)?u:Object.assign({},e,u),n.forEach((n=>n(e,t)))}},u=()=>e,o={setState:r,getState:u,getInitialState:()=>s,subscribe:t=>(n.add(t),()=>n.delete(t)),destroy:()=>{n.clear()}},s=e=t(r,u,o);return o};var u={exports:{}},o={},s={exports:{}},c={},a=t;var i="function"==typeof Object.is?Object.is:function(t,e){return t===e&&(0!==t||1/t==1/e)||t!=t&&e!=e},f=a.useState,l=a.useEffect,v=a.useLayoutEffect,S=a.useDebugValue;function d(t){var e=t.getSnapshot;t=t.value;try{var n=e();return!i(t,n)}catch(r){return!0}}var p="undefined"==typeof window||void 0===window.document||void 0===window.document.createElement?function(t,e){return e()}:function(t,e){var n=e(),r=f({inst:{value:n,getSnapshot:e}}),u=r[0].inst,o=r[1];return v((function(){u.value=n,u.getSnapshot=e,d(u)&&o({inst:u})}),[t,n,e]),l((function(){return d(u)&&o({inst:u}),t((function(){d(u)&&o({inst:u})}))}),[t]),S(n),n};c.useSyncExternalStore=void 0!==a.useSyncExternalStore?a.useSyncExternalStore:p,s.exports=c;var b=t,y=s.exports;
/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var g="function"==typeof Object.is?Object.is:function(t,e){return t===e&&(0!==t||1/t==1/e)||t!=t&&e!=e},x=y.useSyncExternalStore,E=b.useRef,h=b.useEffect,j=b.useMemo,w=b.useDebugValue;o.useSyncExternalStoreWithSelector=function(t,e,n,r,u){var o=E(null);if(null===o.current){var s={hasValue:!1,value:null};o.current=s}else s=o.current;o=j((function(){function t(t){if(!a){if(a=!0,o=t,t=r(t),void 0!==u&&s.hasValue){var e=s.value;if(u(e,t))return c=e}return c=t}if(e=c,g(o,t))return e;var n=r(t);return void 0!==u&&u(e,n)?(o=t,e):(o=t,c=n)}var o,c,a=!1,i=void 0===n?null:n;return[function(){return t(e())},null===i?void 0:function(){return t(i())}]}),[e,n,r,u]);var c=x(t,o[0],o[1]);return h((function(){s.hasValue=!0,s.value=c}),[c]),w(c),c},u.exports=o;const O=e(u.exports),{useDebugValue:m}=n,{useSyncExternalStoreWithSelector:V}=O;const D=t=>t;const I=t=>{const e="function"==typeof t?(t=>t?r(t):r)(t):t,n=(t,n)=>function(t,e=D,n){const r=V(t.subscribe,t.getState,t.getServerState||t.getInitialState,e,n);return m(r),r}(e,t,n);return Object.assign(n,e),n},R=t=>t?I(t):I;export{R as c};
