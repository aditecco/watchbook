/* ---------------------------------
Home
--------------------------------- */

import React, { useEffect, useReducer, useContext, useState } from "react";
import _ from "lodash";
import uuidv4 from "uuid";
import Card from "../../components/Card/Card";
import WatchedList from "../../components/WatchedList/WatchedList";
import Layout from "../../components/Layout/Layout";
import SearchField from "../../components/SearchField/SearchField";
import AutoSuggest from "../../components/AutoSuggest/AutoSuggest";
import { LOCAL_STORAGE_KEY } from "../../constants";
import { log, storage } from "../../utils";
import { AuthContext, StoreContext, db } from "../../App";
import { useApiKey } from "../../hooks";
import DataProvider from "../../components/DataProvider";
import { useSelector, useDispatch } from "react-redux";
import {
  showNotif,
  createToWatch,
  toggleModal,
  createWatched,
} from "../../actions";

function Home() {
  const [state, setState] = useReducer(
    (state, newState) => ({
      ...state,
      ...newState,
    }),
    {
      loading: false,
      searchResults: {},
      searchQuery: "",
      hasError: false,
      showSearchResults: false,
      selectedCard: {},
    }
  );

  const dispatch = useDispatch();
  const { user } = useSelector(state => state.authentication);
  const hasApiKey = useApiKey();
  const { uid } = user;
  const dbRef = db.ref();
  const contentRef = db.ref("content");
  const userRef = db.ref(`users/${uid}`);

  /**
   * syncStorage
   */

  function syncStorage({ watched, toWatch }) {
    const localData = storage.pull(LOCAL_STORAGE_KEY);

    storage.push(LOCAL_STORAGE_KEY, {
      ...localData,
      watched: watched ? [watched, ...localData.watched] : localData.watched,
      toWatch: toWatch ? [toWatch, ...localData.toWatch] : localData.toWatch,
    });
  }

  /**
   * Gets data from API based on
   * the user's query
   */

  const fetchQueryData = async query => {
    const KEY = storage.pull("OMDbApiKey");
    const endpoint = (key, query) =>
      `https://www.omdbapi.com/?apiKey=${key}&s=${query}`;

    setState({ loading: true });

    try {
      const request = await fetch(
        // "https://cors-anywhere.herokuapp.com/" + endpoint
        endpoint(KEY, query)
      );

      const response = await request.json();

      if ("Error" in response) {
        /**
         * TODO
         *
         * very WIP
         * prevent multiple notifs to be fired
         * could use hasError: false in state
         * to lock searches until the error
         * is resolved
         */

        dispatch(
          showNotif({
            message: `${request.status} Error: ${response.Error}`,
            icon: null,
            timeOut: 4000,
          })
        );

        throw new Error(response.Error);
      }

      setState({
        searchResults: response,
        showSearchResults: true,
        loading: false,
      });
    } catch (err) {
      console.error("@fetchData: ", err);
    }
  };

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

    const newItemRef = contentRef.push().key;

    const updates = {
      [`/content/${newItemRef}`]: newItem,
      [`/users/${uid}/toWatch/${newItemRef}`]: true,
    };

    dbRef.update(updates, err => {
      if (err) {
        // TODO handle error
        console.error(err);
      } else {
        dispatch(toggleModal());

        dispatch(
          showNotif({
            message: `To Watch: ${newItem.title}`,
            icon: null,
            timeOut: 2000,
          })
        );
      }
    });

    setState({
      showSearchResults: false,
      searchQuery: "",
    });
  }

  /**
   * Handles creation of new watched items
   */

  const handleAddWatched = data => {
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
            icon: null,
            timeOut: 2000,
          })
        );
      }
    });

    setState({
      showSearchResults: false,
      searchQuery: "",
    });
  };

  /**
   * Handles search queries from the
   * main input field
   */

  const handleSearch = e => {
    const { value: searchQuery } = e.currentTarget;

    if (searchQuery.length > 2) {
      fetchQueryData(searchQuery);
    }

    setState({
      searchQuery,
    });
  };

  /**
   * Handles resetting
   * the main search field
   */

  function handleSearchReset() {
    setState({ searchQuery: "", showSearchResults: false });
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

  const handleAutoSuggestClick = id => {
    const which = state.searchResults.Search.find(item => item.imdbID === id);

    dispatch(
      toggleModal({
        children: (
          <Card
            image={which.Poster}
            title={which.Title}
            type={which.Type}
            year={which.Year}
            onWatchedClick={handleAddWatched}
            onToWatchClick={handleAddToWatch}
          />
        ),
        closeAction: () => dispatch(toggleModal()),
      })
    );
  };

  return (
    <Layout rootClass="Home" selected={1}>
      <div className="wrapper">
        {/* ========================
        ITEM SEARCH
        ======================== */}
        <section className="search">
          <SearchField
            searchQuery={state.searchQuery}
            searchHandler={_.throttle(handleSearch, 6000, { trailing: true })}
            focusHandler={handleFocus}
            resetHandler={handleSearchReset}
          >
            {state.showSearchResults && (
              <AutoSuggest
                content={state.searchResults.Search}
                onItemClick={handleAutoSuggestClick}
                limit={5}
              />
            )}
          </SearchField>
        </section>

        {/* ========================
        WATCHED & TO WATCH
        ======================== */}

        <DataProvider
          dataSet="watched"
          render={data => (
            <WatchedList watched={data} title="Latest watched" limit={6} />
          )}
        />

        {/* TODO */}
        {/* <DataProvider
          dataSet="toWatch"
          render={(data) => (
            <WatchedList watched={data} title="Latest To Watch" limit={6} />
          )}
        /> */}
      </div>
    </Layout>
  );
}

export default Home;
