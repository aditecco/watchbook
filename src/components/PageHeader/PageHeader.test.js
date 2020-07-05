/* ---------------------------------
PageHeader test
--------------------------------- */

import React from "react";
import { render } from "@testing-library/react";
import PageHeader from "./PageHeader";

it("renders title prop", () => {
  const { getByText } = render(<PageHeader title="Lorem Ipsum" />);
  expect(getByText("Lorem Ipsum")).toBeInTheDocument();
});
