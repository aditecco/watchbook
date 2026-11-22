/* ---------------------------------
Types
--------------------------------- */

import { PRIMARY_DATASET_KEY, SECONDARY_DATASET_KEY } from "../constants";

export type Dataset = typeof PRIMARY_DATASET_KEY | typeof SECONDARY_DATASET_KEY;

// TODO complete type w/ TMDB types
export type ContentItem = {
  key: string;
  actors: string;
  awards: string;
  boxoffice: string;
  country: string;
  director: string;
  dvd: string;
  genre: string;
  id: string;
  imdbid: string;
  imdbrating: string;
  imdbvotes: string;
  language: string;
  metascore: string;
  plot: string;
  poster: string;
  production: string;
  rated: string;
  ratings: {
    Source: string;
    Value: string;
  }[];
  released: string;
  response: string;
  runtime: string;
  timestamp: number;
  website: string;
  writer: string;
  rating: number;
  tags: Record<string, boolean>;
};

// Runtime
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

// Tags
type TagLabel = "provider" | "status";

type TagProvider = "Netflix" | "Mubi" | "NowTV" | "Amazon Prime Video" | "DVD";

type TagStatus = "dropped" | "completed";

type TagValue = TagProvider | TagStatus | "";

export type TagType = {
  id: string;
  timestamp: number;
  value: TagValue;
  label: TagLabel;
  assignedTo: Record<string, boolean>;
};

export type TagCollectionType = Record<string, TagType>;

export type SearchFormInitialStateType = {
  searchQuery: string;
  hasError: boolean;
  error: string;
  searchByID: boolean;
};

// Filters (FilterProvider / FilterAndSort)
export type FilterSortKey =
  | "year"
  | "director"
  | "country"
  | "genre"
  | "type"
  | "runtime";

/** [value, label?]; the first entry of each list is the "Select a …" placeholder. */
export type FilterOption = string[];
export type FilterOptions = Record<string, FilterOption[]>;
export type ActiveFilters = Record<string, string>;
export type FilterQuery = { activeFilters: ActiveFilters; searchQuery: string };

/** A content item as DataProvider hands it to the filters (string-valued fields). */
export type FilterableItem = {
  title?: string | null;
  runtime?: string | null;
  [key: string]: unknown;
};
