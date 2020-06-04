/* ---------------------------------
Home
--------------------------------- */

import React, { useReducer, useEffect } from "react";
import ContentList from "../../components/ContentList/ContentList";
import Layout from "../../components/Layout/Layout";
import SearchField from "../../components/SearchField/SearchField";
import AutoSuggest from "../../components/AutoSuggest/AutoSuggest";
import { useApiKey } from "../../hooks";
import DataProvider from "../../components/DataProvider";
import { PRIMARY_DATASET_KEY, SECONDARY_DATASET_KEY } from "../../constants";
import { useSelector, useDispatch } from "react-redux";
import {
  showNotif,
  fetchQueryData,
  fetchAdditionalData,
  resetQueryData,
} from "../../redux/actions";

function Home() {
  const [state, setState] = useReducer(
    (state, newState) => ({
      ...state,
      ...newState,
    }),
    {
      searchQuery: "",
      hasError: false,
      error: "",
    }
  );

  const dispatch = useDispatch();
  const {
    user: { uid },
  } = useSelector(state => state.authentication);
  const userData = useSelector(state => state.userData);
  const apiData = useSelector(state => state.apiData);
  const { watched, toWatch } = userData[uid];
  const hasApiKey = useApiKey();

  /**
   * Finds out if a search query
   * already exists in local data
   */

  function detectDuplicates(query, callback) {
    const dataSet = [...watched, ...toWatch];
    const compareFn = item =>
      item.title && item.title.toLowerCase() === query.toLowerCase();

    if (dataSet.some(compareFn)) {
      setState({ hasError: true, error: "duplicateContent" });

      dispatch(
        showNotif({
          message: "Oops! You already added this item.",
          timeOut: 4000,
        })
      );
    } else {
      setState({ hasError: false, error: "" });
      callback(query);
    }
  }

  /**
   * Handles search queries from the
   * main input field
   */

  function handleSearch(e) {
    const { value: searchQuery } = e.currentTarget;

    if (searchQuery.length > 2) {
      detectDuplicates(searchQuery, query => {
        dispatch(fetchQueryData({ query }));
      });
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
    });

    dispatch(resetQueryData());
  }

  /**
   * triggers a request for an API key
   * when the form is in focus
   */

  function handleFocus() {
    !hasApiKey &&
      dispatch(
        showNotif({
          message: "Please set an API key in settings.",
          timeOut: 2000,
        })
      );
  }

  /**
   * Handles item selection from
   * the search result list
   */

  function handleAutoSuggestClick(id) {
    dispatch(fetchAdditionalData({ id }));
  }

  /**
   * Effects
   */

  useEffect(() => {
    // reset scroll position when we enter the page
    window.scrollTo(0, 0);
  }, []);

  // TODO maybe there's a better way
  useEffect(() => {
    apiData.resetSignal && setState({ searchQuery: "" });
  }, [apiData.resetSignal]);

  return (
    <Layout rootClass="Home" selected={1}>
      {/* ========================
        ITEM SEARCH
        ======================== */}
      <section className="search">
        <SearchField
          searchQuery={state.searchQuery}
          searchHandler={handleSearch}
          focusHandler={handleFocus}
          resetHandler={handleSearchReset}
          error={state.error}
        />

        {(apiData.data || apiData.fetching) && (
          <AutoSuggest
            content={(apiData.data && apiData.data.Search) || null}
            onItemClick={handleAutoSuggestClick}
            limit={5}
          />
        )}
      </section>

      {/* ========================
        WATCHED & TO WATCH
        ======================== */}

      <DataProvider
        dataSet={PRIMARY_DATASET_KEY}
        render={data => (
          <ContentList
            content={data}
            title="Latest watched"
            limit={10}
            dataSet={PRIMARY_DATASET_KEY}
          />
        )}
      />
    </Layout>
  );
}

export default Home;
