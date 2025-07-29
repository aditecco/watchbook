/* ---------------------------------
Utils
--------------------------------- */

import { OMDB_API_URL } from "../constants";

// requestUrl
export const requestUrl = (key: string, queryAndParams: string): string =>
  `${OMDB_API_URL}${key}${queryAndParams}`;

// buildQuery
export const buildQuery = (params: Record<string, string>): string =>
  Object.entries(params)
    .map(([param, query]) => `&${param}=${query}`)
    .join("");

// concise localStorage, w/ JSON manipulation included
export const storage = (() => {
  const boundFn = (fn: Function) => fn.bind(window.localStorage);

  return {
    pull(item: string) {
      // TODO
      // if no item is passed, return
      // all the content as an array

      try {
        const data = boundFn(window.localStorage.getItem)(item);
        return data && JSON.parse(data);
      } catch (err) {
        // Silently handle localStorage errors
      }
    },
    push(id: string, data: any) {
      try {
        const jsonData = JSON.stringify(data);
        boundFn(window.localStorage.setItem)(id, jsonData);
      } catch (err) {
        // Silently handle localStorage errors
      }
    },
    destroy() {
      boundFn(window.localStorage.clear)();
    },
  };
})();

// random number
export const rand = (): number => {
  const number = Math.floor(Math.random() * 10);

  if (!number) {
    return rand();
  } else {
    return number;
  }
};

// capitalize
export function capitalize(word: string): string | undefined {
  const capitalizer = (w: string) => w.charAt(0).toUpperCase() + w.slice(1);

  if (!word) return undefined;

  if (word.includes(" ")) {
    return word.split(" ").map(capitalizer).join(" ");
  }

  return capitalizer(word);
}

// filterKeys
export function filterKeys(
  obj: Record<string, any>,
  filtered: string[] | string,
): Record<string, any> {
  return Object.entries(obj).reduce(
    (acc, [k, val]) => {
      if (filtered instanceof Array) {
        !filtered.includes(k) && (acc[k] = val);
      } else {
        k !== filtered && (acc[k] = val);
      }

      return acc;
    },
    {} as Record<string, any>,
  );
}

// normalize
export function normalize(data: Record<string, any>): Record<string, any> {
  if (!data) return {};

  return Object.entries(data).reduce(
    (acc, [key, val]) => {
      acc[key.toLowerCase()] = val;
      return acc;
    },
    {} as Record<string, any>,
  );
}

/**
 * handles additional classes
 * @usage: className={"SomeClass" + addClasses(className)}
 */
export function addClasses(classes: string): string {
  return classes ? " " + classes : "";
}

/**
 * Removes dupes from a dataset
 */
export function removeDuplicates<T>(data: T[]): T[] {
  return [...new Set(data)];
}

/**
 * Truncates text at given length
 */
export function clipText(t: string, maxLength: number = 15): string {
  if (t.length < maxLength) return t;

  return t.substring(0, maxLength) + "…";
}
