/* ---------------------------------
FilterAndSort
--------------------------------- */

import React from "react";
// import { action } from "@storybook/addon-actions";
// import {} from '@storybook/addon-docs';
// import {} from '@storybook/addon-knobs';
// import {} from '@storybook/addon-storysource';
// import {} from '@storybook/addon-links';
import FilterAndSort from "../components/FilterAndSort/FilterAndSort";
import "../styles/index.scss";

export const Default = () => (
  <FilterAndSort
    filterHandler={_ => null}
    sortHandler={_ => null}
    resetHandler={_ => null}
    inputValue={""}
    options={[1, 2, 3]}
    toggleCallback={_ => null}
  />
);

export default {
  title: "FilterAndSort",
  component: FilterAndSort
};
