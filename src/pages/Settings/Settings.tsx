/* ---------------------------------
Settings
--------------------------------- */

import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import PageHeader from "../../components/PageHeader/PageHeader";
import { API_KEY_ID } from "../../constants";
import { log, storage } from "../../utils";
import { useSelector, useDispatch } from "react-redux";
import { setApiKey } from "../../redux/actions";
import { RootState } from "../../store";
import RatingControls from "../../components/RatingControls/RatingControls";

export default function Settings() {
  const [input, setInput] = useState("");
  const [hasKey, setHasKey] = useState(false);
  const {
    user: { uid },
  } = useSelector((state: RootState) => state.authentication);
  const { app, version, build, source } = useSelector(
    (state: RootState) => state.meta
  );
  const userData = useSelector((state: RootState) => state.userData);
  const dispatch = useDispatch();
  const apiKey = userData[uid].settings.apiKey || storage.pull(API_KEY_ID);

  useEffect(() => {
    // reset scroll position when we enter the page
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (apiKey) setHasKey(true);
  }, [apiKey]);

  /**
   * handleSaveKey
   */

  function handleSaveKey() {
    if (!input) {
      window.alert("nope!");

      return;
    }

    setInput("");
    dispatch(setApiKey({ key: input, uid }));

    storage.push(API_KEY_ID, input);
  }

  return (
    // TODO
    // @ts-ignore
    <Layout rootClass="Settings">
      <PageHeader
        title="Settings"
        // icon="settings"
      />

      <div className="wrapper thin">
        {hasKey ? (
          <div className="p">Your API key: {apiKey}</div>
        ) : (
          <form className="SettingsForm">
            <label className="SettingsFormLabel">Save your API Key</label>

            <input
              className="BaseInput"
              type="text"
              placeholder="API key"
              onChange={e => setInput(e.currentTarget.value)}
              value={input}
            />

            <button
              type="button"
              className="BaseButton"
              onClick={handleSaveKey}
            >
              Save
            </button>
          </form>
        )}

        <RatingControls />

        <footer className="SettingsFooter">
          <small>
            {app} {version}-{build} &middot; <a href={source}>source</a>
          </small>
        </footer>
      </div>
    </Layout>
  );
}
