/* ---------------------------------
Utils
--------------------------------- */

// shorter console.log
export const log = window.console.log.bind(window.console);

// shorter querySelector
export const $ = window.document.querySelector.bind(window.document);

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
    }
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
