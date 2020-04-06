/* ---------------------------------
store
--------------------------------- */

import { configureStore } from "@reduxjs/toolkit";
import initialState from "./initialState";
import reducer from "./reducer";

const store = configureStore({
  reducer,
});

export default store;
