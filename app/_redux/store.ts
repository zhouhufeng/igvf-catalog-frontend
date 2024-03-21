import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";

import graphReducer from './slices/graphSlice';
import queryReducer from "./slices/querySlice";
import regionViewReducer from "./slices/regionViewSlice";
import searchReducer from "./slices/searchSlice";
import settingsReducer from "./slices/settingsSlice";
import uiReducer from "./slices/uiSlice";

const rootReducer = combineReducers({
  graph: graphReducer,
  query: queryReducer,
  regionView: regionViewReducer,
  search: searchReducer,
  ui: uiReducer,
  settings: settingsReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
