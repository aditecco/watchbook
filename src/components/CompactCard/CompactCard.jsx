/* ---------------------------------
CompactCardAnchor
--------------------------------- */

import React from "react";
import { clipText } from "../../utils";
import { useDispatch } from "react-redux";
import * as actions from "../../redux/actions";
import Card from "../Card/Card";

export default React.memo(function CompactCard({
  image,
  title,
  type,
  year,
  onToWatchClick,
  onWatchedClick,
  additionalData,
  ...other
}) {
  const dispatch = useDispatch();

  function convertToFullSizeCard() {
    dispatch(
      actions.toggleModal({
        content: (
          <Card
            added
            image={image}
            title={title}
            type={type}
            year={year}
            additionalData={additionalData}
          />
        ),
      })
    );
  }

  return (
    <div className="CompactCardContainer">
      <article className="CompactCard" onClick={convertToFullSizeCard}>
        <section className="CompactCardMedia" style={{ padding: 0 }}>
          <img src={image} alt={title} className="CompactCardPoster" />
        </section>

        <section className="CompactCardBody">
          <header className="CompactCardHeader">
            <h4 className="CompactCardHeading">{title}</h4>
          </header>
          <span className="CompactCardContent">
            {year + ", " + clipText(additionalData.director, 22)}
          </span>
        </section>
      </article>
    </div>
  );
});
