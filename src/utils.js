/* ---------------------------------
Utils
--------------------------------- */

import { OMDB_API_URL } from "./constants";

// concise console.log
export const log = window.console.log.bind(window.console);

// concise querySelector
export const $ = window.document.querySelector.bind(window.document);

// requestUrl
export const requestUrl = (key, queryAndParams) =>
  `${OMDB_API_URL}${key}${queryAndParams}`;

// buildQuery
export const buildQuery = params =>
  Object.entries(params)
    .map(([param, query]) => `&${param}=${query}`)
    .join("");

// concise localStorage, w/ JSON manipulation included
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
    return word
      .split(" ")
      .map(capitalizer)
      .join(" ");
  }

  return capitalizer(word);
}

// filterKeys
export function filterKeys(obj, filtered) {
  return Object.entries(obj).reduce((acc, [k, val]) => {
    if (filtered instanceof Array) {
      !filtered.includes(k) && (acc[k] = val);
    } else {
      k !== filtered && (acc[k] = val);
    }

    return acc;
  }, {});
}

// normalize
export function normalize(data) {
  return Object.entries(data).reduce((acc, [key, val]) => {
    acc[key.toLowerCase()] = val;
    return acc;
  }, {});
}

// handles additional classes
// usage: className={"SomeClass" + addClasses(className)}
export function addClasses(classes) {
  return classes ? " " + classes : "";
}

/**
 * Removes dupes from a dataset
 */

export function removeDuplicates(data) {
  return [...new Set(data)];
}

/**
 * Truncates text at given limit
 */

export function clipText(t, maxLength = 15) {
  if (t.length < maxLength) return t;

  return t.substring(0, maxLength) + "…";
}
