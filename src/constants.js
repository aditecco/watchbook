/* ---------------------------------
Constants
--------------------------------- */

export const LOCAL_STORAGE_KEY = "watchBookStore";
export const API_KEY_ID = "OMDbApiKey";
export const OMDB_API_URL = "https://www.omdbapi.com/?apiKey=";
export const MOCK_API = "https://jsonplaceholder.typicode.com/todos/1";
export const PRIMARY_DATASET_KEY = "watched";
export const SECONDARY_DATASET_KEY = "toWatch";
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
