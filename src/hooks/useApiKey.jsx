/* ---------------------------------
useApiKey
--------------------------------- */

import { useEffect, useState, useContext } from "react";
import { AuthContext, StoreContext } from "../App";
import { storage } from "../utils";
import { API_KEY } from "../constants";

export default function useApiKey() {
  const [key, setKey] = useState("");
  const [{ user }] = useContext(AuthContext);
  const [store] = useContext(StoreContext);
  const { apiKey } = store.userData[user.uid].settings;
  const persistedKey = storage.pull(API_KEY);

  useEffect(() => {
    const key = apiKey || persistedKey;

    key && setKey(key);
  }, []);

  return key;
}
