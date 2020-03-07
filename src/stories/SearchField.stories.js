import React from "react";
import { action } from "@storybook/addon-actions";
import SearchField from "../components/SearchField/SearchField";
import "../components/SearchField/build.css";
import "../components/SearchField/SearchField.scss";

export default {
  title: "SearchField",
  component: SearchField
};

const SearchFieldProps = {
  onSearch: action("handleSearch"),
  onFocus: action("handleFocus"),
  onReset: action("handleSearchReset"),
  searchQuery: ""
};

export const Default = () => <SearchField {...SearchFieldProps} />;
