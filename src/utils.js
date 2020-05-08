/* ---------------------------------
Utils
--------------------------------- */

import { OMDB_API_URL } from "./constants";

// shorter console.log
export const log = window.console.log.bind(window.console);

// shorter querySelector
export const $ = window.document.querySelector.bind(window.document);

// requestUrl
export const requestUrl = (key, queryAndParams) =>
  `${OMDB_API_URL}${key}${queryAndParams}`;

// buildQuery
export const buildQuery = params =>
  Object.entries(params)
    .map(([param, query]) => `&${param}=${query}`)
    .join("");

// shorter localStorage, w/ JSON manipulation included
export const storage = (() => {
  const boundFn = fn => fn.bind(window.localStorage);

  return {
    pull(item) {
      // TODO
      // if no item is passed, return
      // all the content as an array

      try {
        const data = boundFn(window.localStorage.getItem)(item);
        return data && JSON.parse(data);
      } catch (err) {
        console.error(err);
      }
    },
    push(id, data) {
      try {
        data = JSON.stringify(data);
        boundFn(window.localStorage.setItem)(id, data);
      } catch (err) {
        console.error(err);
      }
    },
    destroy() {
      boundFn(window.localStorage.clear)();
    },
  };
})();

// random number
export const rand = () => {
  const number = Math.floor(Math.random() * 10);

  if (!number) {
    return rand();
  } else {
    return number;
  }
};

// capitalize
export function capitalize(word) {
  const capitalizer = w => w.charAt(0).toUpperCase() + w.slice(1);

  if (!word) return undefined;

  if (word.includes(" ")) {
    return word.split(" ").map(capitalizer).join(" ");
  }

  return capitalizer(word);
}

// filterKeys
// TODO support for more than 1 filtered item
export function filterKeys(obj, filtered) {
  return Object.entries(obj).reduce((acc, [k, val]) => {
    k !== filtered && (acc[k] = val);

    return acc;
  }, {});
}
