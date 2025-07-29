"use client";

import ContentPage from "@/components/pages/ContentPage/ContentPage";
import { PRIMARY_DATASET_KEY } from "@/constants";

export default function WatchedPage() {
  return (
    <ContentPage
      dataSet={PRIMARY_DATASET_KEY}
      selectedIndex={2}
      title="Watched"
    />
  );
}
