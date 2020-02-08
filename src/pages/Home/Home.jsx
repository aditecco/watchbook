/* ---------------------------------
App
--------------------------------- */

import React, { useEffect, useReducer, useContext, useState } from "react";
import { Link } from "react-router-dom";
import uuidv4 from "uuid";
import Card from "../../components/Card/Card";
import WatchedList from "../../components/WatchedList/WatchedList";
import Layout from "../../components/Layout/Layout";
import MaterialIcon from "../../components/Misc/MaterialIcon";
import Modal from "../../components/Modal/Modal";
import AutoSuggest from "../../components/AutoSuggest/AutoSuggest";
import { LOCAL_STORAGE_KEY } from "../../constants";
import { log, storage } from "../../utils";
import { Global } from "../../App";
import store from "../../store";

function Home() {
  const [state, setState] = useReducer(
    (state, newState) => ({
      ...state,
      ...newState
    }),
    {
      isLoading: false,
      searchResults: {},
      searchQuery: "",
      showModal: false,
      showError: false,
      showSearchResults: false,
      selectedCard: {}
    }
  );

  const [{ watched }, dispatch] = useContext(Global);

  useEffect(() => {
    /**
     * Checks if any initial data exists and,
     * if so, feeds it to the main app's state
     */
    const initialData = storage.pull(LOCAL_STORAGE_KEY);

    if (!initialData) {
      storage.push(LOCAL_STORAGE_KEY, store);
    }

    dispatch({ type: "SET_INITIAL_DATA", payload: initialData });
  }, []);

  function syncStorage({ watched, toWatch }) {
    const localData = storage.pull(LOCAL_STORAGE_KEY);

    storage.push(LOCAL_STORAGE_KEY, {
      ...localData,
      watched: watched ? [watched, ...localData.watched] : localData.watched,
      toWatch: toWatch ? [toWatch, ...localData.toWatch] : localData.toWatch
    });
  }

  /**
   * Gets data from API based on
   * the user's query
   */

  const fetchData = async query => {
    // const endpoint = `http://swapi.co/api/planets/${rand()}/`;
    const KEY = storage.pull("OMDbApiKey");
    const endpoint = (key, query) =>
      `https://www.omdbapi.com/?apiKey=${key}&s=${query}`;

    setState({
      isLoading: true
    });

    try {
      const request = await fetch(
        // "https://cors-anywhere.herokuapp.com/" + endpoint
        endpoint(KEY, query)
      );

      const response = await request.json();

      if ("Error" in response) {
        return;
      }

      setState({
        searchResults: response,
        showSearchResults: true
      });
    } catch (err) {
      console.error("@fetchData: ", err);
    }
  };

  /**
   * Handles creation of new watched items
   */

  const handleAddWatched = data => {
    const id = uuidv4(),
      timestamp = new Date();

    const payload = {
      id,
      timestamp,
      ...data
    };

    dispatch({ type: "CREATE_WATCHED", payload });
    syncStorage({ watched: payload });

    setState({
      showModal: false,
      showSearchResults: false,
      searchQuery: ""
    });

    // const localData = [payload, ...storage.Get(WATCHED_KEY)];

    // storage.Set(WATCHED_KEY, localData);
  };

  /**
   * Handles search queries from the
   * main input field
   */

  const handleSearch = e => {
    const { value: searchQuery } = e.currentTarget;

    if (searchQuery.length > 2) {
      setTimeout(() => fetchData(searchQuery), 0);
    }

    setState({
      searchQuery
    });
  };

  /**
   * Handles item selection from
   * the search result list
   */

  const handleAutoSuggestClick = id => {
    const which = state.searchResults.Search.find(item => item.imdbID === id);

    setState({
      showModal: true,
      selectedCard: which
    });
  };

  /**
   * Placeholders
   */

  const handleClick = e => fetchData(state.searchQuery);

  function logTarget(e) {
    log(e.currentTarget);
  }

  return (
    <Global.Consumer>
      {([store, dispatch]) => (
        <Layout rootClass="Home" selected={1}>
          <div className="wrapper">
            {/* Selected card modal */}
            <Modal
              open={state.showModal}
              closeAction={() => setState({ showModal: false })}
            >
              <Card
                image={state.selectedCard.Poster}
                title={state.selectedCard.Title}
                type={state.selectedCard.Type}
                year={state.selectedCard.Year}
                onWatchedClick={handleAddWatched}
                onToWatchClick={logTarget}
              />
            </Modal>

            {/* Item search */}
            <section className="search">
              <header className="appHeader">
                <h1 className="appTitle">
                  Watch<span>Book</span>
                </h1>

                <nav className="appMenu">
                  <ul className="appMenuContainer">
                    <li>
                      <Link to="/profile">
                        <MaterialIcon icon="account_circle" />
                      </Link>
                    </li>

                    <li>
                      <Link to="/settings">
                        <MaterialIcon icon="settings" />
                      </Link>
                    </li>

                    {/* <li>
                      <Link to="/test">
                        <MaterialIcon icon="build" />
                      </Link>
                    </li> */}
                  </ul>
                </nav>
              </header>

              <form className="itemSearch">
                <>
                  <input
                    className="mainSearchField"
                    type="text"
                    onChange={handleSearch}
                    placeholder="Search for a movie or TV show…"
                  />

                  {state.showSearchResults && (
                    <AutoSuggest
                      content={state.searchResults.Search}
                      onItemClick={handleAutoSuggestClick}
                      limit={5}
                    />
                  )}
                </>
              </form>
            </section>

            {/* watched */}
            <WatchedList
              watched={store.watched}
              title="Latest watched"
              limit={6}
            />
          </div>
        </Layout>
      )}
    </Global.Consumer>
  );
}

export default Home;
