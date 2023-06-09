import { configureStore } from "@reduxjs/toolkit";

import connectionReducer from "../features/connection/connectionSlice";
import tokensReducer from "../features/tokens/tokensSlice";
import exchangeReducer from "../features/exchange/exchangeSlice";

export const store = configureStore({
	reducer: {
		connection: connectionReducer,
		tokens: tokensReducer,
		exchange: exchangeReducer,
	},
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
