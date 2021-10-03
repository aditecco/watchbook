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
