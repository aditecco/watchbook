/* ---------------------------------
Home
--------------------------------- */

import React, { useReducer, useEffect } from "react";
import _ from "lodash";
import axios from "axios";
import uuidv4 from "uuid";
import Card from "../../components/Card/Card";
import WatchedList from "../../components/WatchedList/WatchedList";
import Layout from "../../components/Layout/Layout";
import SearchField from "../../components/SearchField/SearchField";
import AutoSuggest from "../../components/AutoSuggest/AutoSuggest";
import { storage } from "../../utils";
import { db } from "../../App";
import { useApiKey } from "../../hooks";
import DataProvider from "../../components/DataProvider";
import { useSelector, useDispatch } from "react-redux";
import { log } from "../../utils";
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
      showSearchResults: false,
      searchResults: null,
      searchQuery: "",
      hasError: false,
      selectedCard: {},
    }
  );

  const dispatch = useDispatch();
  const { user } = useSelector(state => state.authentication);
  const hasApiKey = useApiKey();
  const { uid } = user;
  const dbRef = db.ref();
  const contentRef = db.ref("content");
  const API_KEY = storage.pull("OMDbApiKey");
  const API_URL = `https://www.omdbapi.com/?apiKey=`;

  const requestUrl = (key, queryAndParams) =>
    `${API_URL}${key}${queryAndParams}`;

  const buildQuery = params =>
    Object.entries(params)
      .map(([param, query]) => `&${param}=${query}`)
      .join("");

  /**
   * Gets data from API based on
   * the user's query
   */

  async function fetchQueryData(query) {
    setState({ loading: true, showSearchResults: true });

    try {
      const request = await axios.get(
        requestUrl(API_KEY, buildQuery({ s: query }))
      );

      const { data: response } = request;

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
        loading: false,
        searchResults: response,
      });
    } catch (err) {
      // console.error("@fetchData: ", err);
    }
  }

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
      loading: false,
      searchQuery: "",
      searchResults: null,
    });
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
            icon: null,
            timeOut: 2000,
          })
        );
      }
    });

    setState({
      showSearchResults: false,
      loading: false,
      searchQuery: "",
      searchResults: null,
    });
  }

  /**
   * Handles search queries from the
   * main input field
   */

  function handleSearch(e) {
    const { value: searchQuery } = e.currentTarget;

    if (searchQuery.length > 2) {
      fetchQueryData(searchQuery);
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
      searchResults: null,
    });
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
    const which = state.searchResults.Search.find(item => item.imdbID === id);

    setState({ loading: true });

    fetchAdditionalData(id).then(additionalData => {
      setState({ loading: false });

      dispatch(
        toggleModal({
          content: (
            <Card
              image={which.Poster}
              title={which.Title}
              type={which.Type}
              year={which.Year}
              additionalData={additionalData}
              onWatchedClick={handleAddWatched}
              onToWatchClick={handleAddToWatch}
            />
          ),
        })
      );
    });
  }

  /**
   * Gets additional data for the selected card
   */

  async function fetchAdditionalData(id) {
    // prettier-ignore
    try
    {
      const request = await axios.get(
        requestUrl(API_KEY, buildQuery({ i: id }))
      );

      return request.data;
    }
    
    catch (err) {
      dispatch(
        showNotif({
          message: err.message,
          icon: null,
          timeOut: 4000,
        })
      );
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
      <div className="wrapper">
        {/* ========================
        ITEM SEARCH
        ======================== */}
        <section className="search">
          <SearchField
            searchQuery={state.searchQuery}
            searchHandler={_.throttle(handleSearch, 6000, { trailing: true })} // TODO!
            focusHandler={handleFocus}
            resetHandler={handleSearchReset}
          >
            {state.showSearchResults && (
              <AutoSuggest
                content={state.searchResults && state.searchResults.Search}
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
