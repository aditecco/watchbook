/* ---------------------------------
useApiKey
--------------------------------- */

import { useEffect, useState } from "react";
import { storage } from "../utils";
import { API_KEY_ID } from "../constants";
import { useSelector } from "react-redux";
import { RootState } from "../store";

export default function useApiKey() {
  const [key, setKey] = useState("");
  const { user } = useSelector((state: RootState) => state.authentication);
  const userData = useSelector((state: RootState) => state.userData);
  const { apiKey } = userData[user.uid].settings;
  const persistedKey = storage.pull(API_KEY_ID);

  useEffect(() => {
    const key = apiKey || persistedKey;

    key && setKey(key);
  }, []);

  return key;
}
