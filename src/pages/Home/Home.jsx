/* ---------------------------------
Home
--------------------------------- */

import React, { useReducer, useEffect } from "react";
import axios from "axios";
import uuidv4 from "uuid";
import Card from "../../components/Card/Card";
import WatchedList from "../../components/WatchedList/WatchedList";
import Layout from "../../components/Layout/Layout";
import SearchField from "../../components/SearchField/SearchField";
import AutoSuggest from "../../components/AutoSuggest/AutoSuggest";
import MaterialIcon from "../../components/Misc/MaterialIcon";
import { requestUrl, buildQuery, storage, log } from "../../utils";
import { db } from "../../index";
import { useApiKey } from "../../hooks";
import DataProvider from "../../components/DataProvider";
import { useSelector, useDispatch } from "react-redux";
import { API_KEY_ID } from "../../constants";
import {
  showNotif,
  createToWatch,
  toggleModal,
  createWatched,
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
      loading: false,
      showSearchResults: false,
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
  const apiKey = storage.pull(API_KEY_ID);
  const dbRef = db.ref();
  const contentRef = db.ref("content");

  /**
   * Handles creation of new to-watch items
   */

  function handleAddToWatch(data) {
    const id = uuidv4();
    const timestamp = Date.now();

    const newItem = {
      id,
      timestamp,
      ...data,
    };

    dispatch(createToWatch({ toWatchItem: newItem, uid }));

    // const newItemRef = contentRef.push().key;

    // const updates = {
    //   [`/content/${newItemRef}`]: newItem,
    //   [`/users/${uid}/toWatch/${newItemRef}`]: true,
    // };

    // dbRef.update(updates, err => {
    //   if (err) {
    //     // TODO handle error
    //     console.error(err);
    //   } else {
    //     dispatch(toggleModal());

    //     dispatch(
    //       showNotif({
    //         message: `To Watch: ${newItem.title}`,
    //         icon: <MaterialIcon icon="bookmark" />,
    //         timeOut: 2000,
    //         theme: "light",
    //       })
    //     );
    //   }
    // });

    setState({
      showSearchResults: false,
      loading: false,
      searchQuery: "",
    });

    dispatch(resetQueryData());
  }

  /**
   * Handles creation of new watched items
   */

  function handleAddWatched(data) {
    const id = uuidv4();
    const timestamp = Date.now();

    const newItem = {
      id,
      timestamp,
      ...data,
    };

    dispatch(createWatched({ watchedItem: newItem, uid }));

    // const newItemRef = contentRef.push().key would return the ref key
    const newItemRef = contentRef.push().key;

    const updates = {
      [`/content/${newItemRef}`]: newItem,
      [`/users/${uid}/watched/${newItemRef}`]: true,
    };

    dbRef.update(updates, err => {
      if (err) {
        // TODO handle error
        console.error(err);
      } else {
        dispatch(toggleModal());

        dispatch(
          showNotif({
            message: `Watched: ${newItem.title}`,
            icon: <MaterialIcon icon="check_circle" />,
            timeOut: 2000,
            theme: "light",
          })
        );
      }
    });

    setState({
      showSearchResults: false,
      loading: false,
      searchQuery: "",
    });

    dispatch(resetQueryData());
  }

  /**
   * Finds out if a search query
   * already exists in local data
   */

  function detectDuplicates(query, callback) {
    const dataSet = [...watched, ...toWatch];
    const compareFn = item => item.title.toLowerCase() === query.toLowerCase();

    if (dataSet.some(compareFn)) {
      setState({ hasError: true, error: "duplicateContent" });

      dispatch(
        showNotif({
          message: "Oops! You already added this item.",
          icon: null,
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
        setState({ loading: true, showSearchResults: true });

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
      showSearchResults: false,
      loading: false,
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
          // icon: "error_outline",
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

        {state.showSearchResults && (
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
        dataSet="watched"
        render={data => (
          <WatchedList watched={data} title="Latest watched" limit={10} />
        )}
      />

      {/* TODO */}
      {/* <DataProvider
          dataSet="toWatch"
          render={(data) => (
            <WatchedList watched={data} title="Latest To Watch" limit={6} />
          )}
        /> */}
    </Layout>
  );
}

export default Home;
