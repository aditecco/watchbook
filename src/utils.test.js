/* ---------------------------------
utils.test.js
--------------------------------- */

import * as u from "./utils";

/**
 * clipText
 */
describe("clipText", () => {
  const sampleText =
    "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aliquam vitae dui. Nulla id libero nec eros pretium facilisis. Donec nulla ipsum, elementum vitae, cursus vitae, accumsan sed, ligula. Curabitur metus dolor, euismod sed, vehicula nec, vestibulum sit amet, ipsum.";

  it("Clips at length 15 if no maxLength is passed", () => {
    expect(u.clipText(sampleText)).toEqual("Lorem ipsum dol…");
  });

  it("Clips at the desired maxLength if specified", () => {
    expect(u.clipText(sampleText, 10)).toEqual("Lorem ipsu…");
  });
});

/**
 * removeDuplicates
 */
describe("removeDuplicates", () => {
  it("Removes duplicates with numbers", () => {
    expect(u.removeDuplicates([1, 1, 2, 3, 4, 4, 4])).toEqual([1, 2, 3, 4]);
  });

  it("Removes duplicates with strings", () => {
    expect(u.removeDuplicates(["x", "y", "y", "z", "z"])).toEqual([
      "x",
      "y",
      "z",
    ]);
  });
});
