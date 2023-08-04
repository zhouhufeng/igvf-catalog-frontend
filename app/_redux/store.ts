import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

import searchReducer from "./slices/searchSlice";

const searchPersistConfig = {
  key: "search",
  storage,
  blacklist: ["searchQuery"],
};

const persistedSearchReducer = persistReducer(searchPersistConfig, searchReducer);

const rootReducer = combineReducers({
  search: persistedSearchReducer,
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
