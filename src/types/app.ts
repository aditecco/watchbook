/* ---------------------------------
Types
--------------------------------- */

import { PRIMARY_DATASET_KEY, SECONDARY_DATASET_KEY } from "../constants";

export type Dataset = typeof PRIMARY_DATASET_KEY | typeof SECONDARY_DATASET_KEY;

export interface WatchedItem {
  id: string;
  image: string;
  timestamp: number;
  title: string;
  type: string;
  year: string;
}

export enum RuntimeFilterLabels {
  UP_TO_30 = "Up to 30 minutes",
  UP_TO_60 = "Up to 60 minutes",
  UP_TO_90 = "Up to 90 minutes",
  UP_TO_100 = "Up to 100 minutes",
  UP_TO_120 = "Up to 120 minutes",
  UP_TO_180 = "Up to 180 minutes",
  UP_TO_200 = "Up to 200 minutes",
  UP_TO_300 = "Up to 300 minutes",
  MORE_THAN_300 = "Over 300 minutes",
}

type TagType = "provider" | "status";

type TagProvider = "Netflix" | "Mubi" | "NowTV" | "Amazon Prime Video" | "DVD";

type TagStatus = "dropped" | "completed";

export type Tag = {
  id: string;
  timestamp: number;
  type: TagType;
  value: TagProvider & TagStatus;
  label: string;
  assignedTo: Record<string, boolean>;
};
