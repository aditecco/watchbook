/* ---------------------------------
SearchField
--------------------------------- */

import React from "react";
import { action } from "@storybook/addon-actions";
import SearchField from "../components/SearchField/SearchField";
import "../styles/index.scss";

const SearchFieldProps = {
  searchHandler: action("handleSearch"),
  focusHandler: action("handleFocus"),
  resetHandler: action("handleSearchReset"),
  searchQuery: "",
};

export const Default = () => <SearchField {...SearchFieldProps} />;

export default {
  title: "SearchField",
  component: SearchField,
};
