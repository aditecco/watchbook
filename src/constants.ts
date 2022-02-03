/* ---------------------------------
Constants
--------------------------------- */

export const LOCAL_STORAGE_KEY = "watchBookStore";
export const API_KEY_ID = "OMDbApiKey";
export const OMDB_API_URL = "https://www.omdbapi.com/?apiKey=";
export const MOCK_API = "https://jsonplaceholder.typicode.com/todos/1";
export const PRIMARY_DATASET_KEY = "watched";
export const SECONDARY_DATASET_KEY = "toWatch";
export const ERROR_GENERIC_ERROR = "An error occurred.";
export const ERROR_PRE_EXISTING_CONTENT = "Oops! You already added this item.";
export const ERROR_PRE_EXISTING_TAG =
  "Oops! The tag is already assigned to this item.";
export const WARNING_VALUE_NEEDED = (item: string) =>
  `Please insert a value for this ${item}.`;

export const UI_LABELS = {
  allLoaded: "All content was loaded.",
  quickSearchPlaceholder: "Filter by title…",
  cardControlsLabels(type) {
    switch (type) {
      case SECONDARY_DATASET_KEY: {
        return ["Set Watched", "Delete"];
      }

      default: {
        return ["Watched", "To Watch"];
      }
    }
  },
};
