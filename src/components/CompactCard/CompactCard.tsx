/* ---------------------------------
CompactCardAnchor
--------------------------------- */

import React, { ReactElement } from "react";
import { clipText } from "../../utils";
import { useDispatch } from "react-redux";
import * as actions from "../../redux/actions";
import Card from "../Card/Card";
import RatingControls from "../RatingControls/RatingControls";
import { Tag } from "../../types";

// TODO
interface OwnProps {
  additionalData;
  dataSet;
  image;
  title;
  type;
  year;
}

export default React.memo(function CompactCard({
  additionalData,
  dataSet,
  image,
  title,
  type,
  year,
}: OwnProps): ReactElement {
  const dispatch = useDispatch();

  function convertToFullSizeCard() {
    dispatch(
      actions.toggleModal({
        forceOpen: true,
        content: (
          <Card
            added
            dataSet={dataSet}
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
        {additionalData.rating ? (
          <RatingControls
            // @ts-ignore
            initialRating={additionalData.rating}
          />
        ) : null}

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

        {additionalData?.tags && (
          <section className="CompactCardTags">
            {additionalData.tags.map?.((tag: Tag, i) => (
              <span key={i} className={"CompactCardTag"}>
                {tag.value}
              </span>
            ))}
          </section>
        )}
      </article>
    </div>
  );
});
