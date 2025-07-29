"use client";

import ContentPage from "@/components/pages/ContentPage/ContentPage";
import { SECONDARY_DATASET_KEY } from "@/constants";

export default function ToWatchPage() {
  return (
    <ContentPage
      dataSet={SECONDARY_DATASET_KEY}
      selectedIndex={3}
      title="To Watch"
    />
  );
}
