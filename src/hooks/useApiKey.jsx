/* ---------------------------------
useApiKey
--------------------------------- */

import { useEffect, useState, useContext } from "react";
import { AuthContext, StoreContext } from "../App";
import { storage } from "../utils";
import { API_KEY } from "../constants";
import { useSelector } from "react-redux";

export default function useApiKey() {
  const [key, setKey] = useState("");
  const { user } = useSelector(state => state.authentication);
  // const [{ user }] = useContext(AuthContext);
  // const [store] = useContext(StoreContext);
  const userData = useSelector(state => state.userData);
  const { apiKey } = userData[user.uid].settings;
  const persistedKey = storage.pull(API_KEY);

  useEffect(() => {
    const key = apiKey || persistedKey;

    key && setKey(key);
  }, []);

  return key;
}
