import { PRIMARY_DATASET_KEY, SECONDARY_DATASET_KEY } from "../constants";

export type Dataset = typeof PRIMARY_DATASET_KEY | typeof SECONDARY_DATASET_KEY;
