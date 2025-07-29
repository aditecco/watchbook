"use client";

import React, { useEffect, useReducer } from "react";
import ContentList from "@/components/ContentList/ContentList";
import Layout from "@/components/Layout/Layout";
import SearchField from "@/components/SearchField/SearchField";
import AutoSuggest from "@/components/AutoSuggest/AutoSuggest";
import DataProvider from "@/components/DataProvider";
import ContentDetailsModal from "@/components/ContentDetailsModal/ContentDetailsModal";
import { PRIMARY_DATASET_KEY } from "@/constants";
import { useAppStore } from "@/store";
import MaterialIcon from "@/components/MaterialIcon/MaterialIcon";
import { SearchFormInitialStateType } from "@/types";
import { OMDBcontentMapper } from "@/lib";
import { useOMDBFetch, useOMDBSearch } from "@/lib/api";

function Home() {
  const [state, setState] = useReducer(
    (state, newState) =>
      ({
        ...state,
        ...newState,
      }) as SearchFormInitialStateType,
    {
      searchQuery: "",
      hasError: false,
      error: "",
      searchByID: false, // TODO make it a config object for advanced search, supporting all APISearchParams options
    },
  );

  const { error, hasError, searchByID, searchQuery } = state;

  const {
    auth,
    userData,
    apiData,
    contentDetailsModal,
    showNotification,
    setApiData,
    resetApiData,
    showContentDetailsModal,
    hideContentDetailsModal,
  } = useAppStore();

  // Wrapper for hideContentDetailsModal that also handles search reset
  const handleContentDetailsModalClose = (
    wasSuccessfulSubmission?: boolean,
  ) => {
    hideContentDetailsModal();

    // Reset search if item was successfully added to watched/to-watch
    if (wasSuccessfulSubmission) {
      handleSearchReset();
    }
  };

  // Remove legacy data filtering - now handled by DataProvider
  // const content = userData.content || {};
  // const watched = Object.values(content).filter((item: any) => item.rating > 0);
  // const toWatch = Object.values(content).filter((item: any) => item.rating === 0);

  // OMDB search query
  const {
    data: searchResults,
    isLoading: isSearching,
    error: searchError,
  } = useOMDBSearch(searchQuery, searchQuery.length > 2 && !searchByID);

  // OMDB search by ID
  const {
    data: fetchResults,
    isLoading: isFetching,
    error: fetchError,
  } = useOMDBFetch(searchQuery, searchQuery.length > 2 && searchByID);

  // Update API data state when search results change
  useEffect(() => {
    if (searchQuery.length > 2) {
      if (!searchByID) {
        // Regular search
        setApiData({
          fetching: isSearching,
          query: searchQuery,
          data: searchResults ? { Search: searchResults } : null,
          error: searchError ? searchError.message : null,
        });
      } else {
        // Search by ID
        setApiData({
          fetching: isFetching,
          query: searchQuery,
          data: fetchResults ? { Search: [fetchResults] } : null,
          error: fetchError ? fetchError.message : null,
        });
      }
    } else if (searchQuery.length === 0) {
      resetApiData();
    }
  }, [
    searchQuery,
    searchResults,
    isSearching,
    searchError,
    fetchResults,
    isFetching,
    fetchError,
    searchByID,
    setApiData,
    resetApiData,
  ]);

  // Show notifications for API errors
  useEffect(() => {
    if (apiData.error) {
      showNotification(apiData.error, "error");
    }
  }, [apiData.error, showNotification]);

  /**
   * Finds out if a search query
   * already exists in local data
   */

  // TODO move out of component
  function detectDuplicates(
    { query, queryParam }: { query: string; queryParam: string },
    callback: (query: string, queryParam: string) => void,
  ) {
    // Temporarily disable duplicate detection until we implement proper checking with new schema
    // TODO: Implement duplicate detection with new database schema
    setState({ hasError: false, error: "" });
    callback(query, queryParam);

    /* Legacy duplicate detection - disabled for now
    const dataSet = [...(watched || []), ...(toWatch || [])];
    const compareFn = (item: any) =>
      item.title && item.title.toLowerCase() === query.toLowerCase();
    // TODO add comparison by ID

    if (dataSet.some(compareFn)) {
      setState({ hasError: true, error: "duplicateContent" });

      showNotification("Oops! You already added this item.", 'error');
    } else {
      setState({ hasError: false, error: "" });
      callback(query, queryParam);
    }
    */
  }

  /**
   * Handles search queries from the
   * main input field
   */
  function handleSearch(
    e: React.ChangeEvent<HTMLInputElement>,
    queryParam: string, // TODO map to actual params, maybe options object
  ) {
    const { value: searchQuery } = e.currentTarget;

    if (searchQuery.length > 2) {
      detectDuplicates(
        { query: searchQuery, queryParam },
        (query, queryParam) => {
          // Search is handled by the useOMDBSearch hook
          // The results will be automatically updated in the store
        },
      );
    }

    setState({ searchQuery });
  }

  /**
   * Handles resetting
   * the main search field
   */

  function handleSearchReset() {
    setState({
      searchQuery: "",
      hasError: false,
      error: "",
      searchByID: false,
    });
    resetApiData();
  }

  /**
   * triggers a request for an API key
   * when the form is in focus
   */

  function handleFocus() {
    // API key is now handled server-side, no need to check client-side
    // This function can be removed or used for other purposes
  }

  /**
   * Handles item selection from
   * the search result list
   */

  function handleAutoSuggestClick(id: string) {
    // Find the search item data from either regular search or ID search
    let searchItem;

    if (searchByID && fetchResults) {
      // For ID search, fetchResults is a single object
      searchItem = fetchResults.imdbID === id ? fetchResults : null;
    } else {
      // For regular search, searchResults is an array
      searchItem = searchResults?.find((item: any) => item.imdbID === id);
    }

    if (searchItem) {
      showContentDetailsModal(id, searchItem);
    }
  }

  /**
   * Effects
   */

  useEffect(() => {
    // reset scroll position when we enter the page
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout rootClass="Home" selected={1}>
      {/* ========================
        ITEM SEARCH
        ======================== */}
      <section className="search">
        <SearchField
          searchQuery={searchQuery}
          onSearch={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleSearch(e, searchByID ? "i" : "s")
          }
          onFocus={handleFocus}
          onReset={handleSearchReset}
          error={Boolean(error)}
        >
          {!searchQuery.length ? (
            <button
              type="button"
              className="searchOptions"
              onClick={() => setState({ searchByID: !searchByID })}
            >
              <MaterialIcon
                icon="tune"
                style={{
                  color: searchByID ? "#1ABC9C" : "inherit",
                }}
              />
            </button>
          ) : null}
        </SearchField>

        {(apiData?.data || apiData?.fetching) && (
          <AutoSuggest
            content={apiData.data}
            contentMapper={OMDBcontentMapper(handleAutoSuggestClick)}
            limit={5}
            fetching={apiData.fetching}
          />
        )}
      </section>

      {/* ========================
        WATCHED & TO WATCH
        ======================== */}

      <DataProvider
        dataSet={PRIMARY_DATASET_KEY}
        render={(data) => (
          <ContentList
            content={data}
            dataSet={PRIMARY_DATASET_KEY}
            title="Recently Watched"
            compact={false}
            limit={10}
          />
        )}
      />

      {/* ========================
        CONTENT DETAILS MODAL
        ======================== */}

      {contentDetailsModal.visible &&
        contentDetailsModal.imdbId &&
        contentDetailsModal.searchItem && (
          <ContentDetailsModal
            imdbId={contentDetailsModal.imdbId}
            searchItem={contentDetailsModal.searchItem}
            onClose={handleContentDetailsModalClose}
          />
        )}
    </Layout>
  );
}

export default Home;
