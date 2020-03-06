/* ---------------------------------
Home
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
import { AuthContext, StoreContext, db } from "../../App";
import { useApiKey } from "../../hooks";
import DataProvider from "../../components/DataProvider";

function Home() {
  const [state, setState] = useReducer(
    (state, newState) => ({
      ...state,
      ...newState
    }),
    {
      loading: false,
      searchResults: {},
      searchQuery: "",
      showModal: false,
      showError: false,
      showSearchResults: false,
      selectedCard: {}
    }
  );

  const [store, dispatch] = useContext(StoreContext);
  const [{ user }] = useContext(AuthContext);
  const hasApiKey = useApiKey();
  const { uid } = user;
  const dbUser = db.ref(`users/${uid}`);

  /**
   * syncStorage
   */

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

    setState({ loading: true });

    try {
      const request = await fetch(
        // "https://cors-anywhere.herokuapp.com/" + endpoint
        endpoint(KEY, query)
      );

      const response = await request.json();

      if ("Error" in response) {
        throw new Error(response.Error);
      }

      setState({
        searchResults: response,
        showSearchResults: true,
        loading: false
      });
    } catch (err) {
      console.error("@fetchData: ", err);
    }
  };

  /**
   * Handles creation of new watched items
   */

  const handleAddWatched = data => {
    const id = uuidv4();
    const timestamp = Date.now();

    const watchedItem = {
      id,
      timestamp,
      ...data
    };

    dispatch({ type: "CREATE_WATCHED", watchedItem, uid });

    dbUser.child("watched").update(
      [watchedItem, ...store.userData[uid]["watched"]],
      // TODO refactor to update just the new item
      // ref: https://firebase.googleblog.com/2014/04/best-practices-arrays-in-firebase.html
      // watchedItem,
      err => {
        if (err) console.error(err);
        else
          dispatch({
            type: "SHOW_NOTIF",
            message: `Watched: ${watchedItem.title}`,
            icon: null,
            timeOut: 2000
          });
      }
    );

    setState({
      showModal: false,
      showSearchResults: false,
      searchQuery: ""
    });
  };

  /**
   * Handles search queries from the
   * main input field
   */

  const handleSearch = e => {
    const { value: searchQuery } = e.currentTarget;

    if (searchQuery.length > 2) {
      setTimeout(() => fetchData(searchQuery), 500);
    }

    setState({
      searchQuery
    });
  };

  /**
   * triggers a request for an API key
   * when the form is in focus
   */

  function handleFocus() {
    !hasApiKey &&
      dispatch({
        type: "SHOW_NOTIF",
        message: "Please set an API key in settings.",
        // icon: "error_outline",
        timeOut: 2000
      });
  }

  /**
   * Handles item selection from
   * the search result list
   */

  const handleAutoSuggestClick = id => {
    const which = state.searchResults.Search.find(item => item.imdbID === id);

    dispatch({
      type: "TOGGLE_MODAL",
      children: (
        <Card
          image={which.Poster}
          title={which.Title}
          type={which.Type}
          year={which.Year}
          onWatchedClick={handleAddWatched}
          onToWatchClick={logTarget}
        />
      ),
      closeAction: () => dispatch({ type: "TOGGLE_MODAL" })
    });

    // setState({
    //   showModal: true,
    //   selectedCard: which
    // });
  };

  /**
   * Placeholders
   */

  function logTarget(e) {
    log(e.currentTarget);
  }

  return (
    <StoreContext.Consumer>
      {([store]) => (
        <Layout rootClass="Home" selected={1}>
          <div className="wrapper">
            {/* ========================
              SELECTED CARD MODAL
              ======================== */}
            {/* <Modal
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
            </Modal> */}

            {/* ========================
              ITEM SEARCH
              ======================== */}
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
                    onFocus={handleFocus}
                    placeholder="Search for a movie or TV show…"
                    value={state.searchQuery}
                  />

                  <button
                    type="button"
                    className="searchCancel"
                    style={{
                      display: `${
                        !state.searchQuery.length ? "none" : "inline-block"
                      }`
                    }}
                    onClick={() =>
                      setState({ searchQuery: "", showSearchResults: false })
                    }
                  >
                    <MaterialIcon icon="close" />
                  </button>

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

            {/* ========================
              WATCHED
              ======================== */}

            <DataProvider
              render={data => (
                <WatchedList watched={data} title="Latest watched" limit={6} />
              )}
            />
          </div>
        </Layout>
      )}
    </StoreContext.Consumer>
  );
}

export default Home;
