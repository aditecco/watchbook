/* ---------------------------------
DataProvider
--------------------------------- */

import React, { useReducer, useEffect } from "react";

export default function DataProvider({ render, filter }) {
  /**
   * gets data from API
   * prepares data for use in the app
   * exposes api for filtering & sorting data
   */

  const [state, setState] = useReducer(
    (state, newState) => ({
      ...state,
      ...newState
    }),
    {
      loading: true,
      data: []
    }
  );

  const { loading, data } = state;

  const loader = <span>loading...</span>;

  useEffect(() => null, []);

  return <>{!loading ? render(data) : loader}</>;
}
