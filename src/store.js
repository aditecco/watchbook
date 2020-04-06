/* ---------------------------------
store
--------------------------------- */

import { configureStore } from "@reduxjs/toolkit";
import reducer from "./_reducer";

const store = configureStore({
  reducer,
});

export default store;
