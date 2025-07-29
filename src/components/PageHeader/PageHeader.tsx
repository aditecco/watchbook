/* ---------------------------------
PageHeader
--------------------------------- */

import React, { ReactElement } from "react";
import MaterialIcon from "@/components/MaterialIcon/MaterialIcon";

// import "./PageHeader.scss";

interface OwnProps {
  title: string;
  icon?: string;
  subHeading?: string | ReactElement[];
}

export default function PageHeader({
  title,
  icon,
  subHeading,
}: OwnProps): ReactElement {
  return (
    <header className="PageHeader">
      <div className="container">
        {icon && <MaterialIcon icon={icon} />}
        <h1 className="PageHeading">{title}</h1>
      </div>

      {subHeading && (
        <div className="container">
          <h4 className="PageSubHeading">{subHeading}</h4>
        </div>
      )}
    </header>
  );
}
