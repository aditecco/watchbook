"use client";

import React, { ReactElement } from "react";
import { useAppStore } from "@/store";
import Card from "../Card/Card";
import RatingControls from "../RatingControls/RatingControls";
// Simple utility function to avoid SSR issues
const clipText = (t: string, maxLength: number = 15) => {
  if (t.length < maxLength) return t;
  return t.substring(0, maxLength) + "…";
};

// TODO
interface OwnProps {
  additionalData: any;
  dataSet: string;
  image: string;
  title: string;
  type: string;
  year: string;
  contentId?: string;
}

export default React.memo(function CompactCard({
  additionalData,
  dataSet,
  image,
  title,
  type,
  year,
  contentId,
}: OwnProps): ReactElement {
  const { showModal } = useAppStore();

  function convertToFullSizeCard() {
    showModal(
      <Card
        added
        dataSet={dataSet}
        image={image}
        title={title}
        type={type}
        year={year}
        contentId={contentId}
        additionalData={additionalData}
      />,
    );
  }

  return (
    <div className="CompactCardContainer">
      <article className="CompactCard" onClick={convertToFullSizeCard}>
        {additionalData.rating &&
        additionalData.rating > 0 &&
        additionalData.status !== "to_watch" ? (
          <RatingControls initialRating={additionalData.rating} />
        ) : null}

        <section className="CompactCardMedia" style={{ padding: 0 }}>
          <img src={image} alt={title} className="CompactCardPoster" />
        </section>

        <section className="CompactCardBody">
          <header className="CompactCardHeader">
            <h4 className="CompactCardHeading">{title}</h4>
          </header>
          <span className="CompactCardContent">
            {year +
              ", " +
              (additionalData.director
                ? clipText(additionalData.director, 22)
                : "Director Unknown")}
          </span>
        </section>

        {additionalData?.tags &&
          Array.isArray(additionalData.tags) &&
          additionalData.tags.length > 0 && (
            <section className="CompactCardTags">
              {additionalData.tags.map((tag: any, i: number) => (
                <span
                  key={i}
                  className={"CompactCardTag"}
                  style={{ backgroundColor: tag.color || "#3B82F6" }}
                >
                  {tag.name}
                </span>
              ))}
            </section>
          )}
      </article>
    </div>
  );
});
