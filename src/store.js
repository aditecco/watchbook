/* ---------------------------------
store
--------------------------------- */

import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import reducer from "./redux/reducer";
import sagas from "./saga/";

const sagaMiddleware = createSagaMiddleware();
const middleware = [...getDefaultMiddleware({ thunk: false }), sagaMiddleware];

const store = configureStore({ reducer, middleware });

sagaMiddleware.run(sagas);
export default store;
