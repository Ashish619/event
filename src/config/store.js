import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import rootReducer from "../reducers";
import { persistReducer, persistStore } from "redux-persist";
import reduxReset from 'redux-reset';
import storageSession from "redux-persist/lib/storage/session";
import { routerMiddleware } from "react-router-redux";
import createHistory from "history/createBrowserHistory";
import { compose } from "recompose";

const history = createHistory();

const enhancer = compose(
	applyMiddleware(thunk, routerMiddleware(history)),
	reduxReset(),
	window.__REDUX_DEVTOOLS_EXTENSION__
		? window.__REDUX_DEVTOOLS_EXTENSION__()
		: f => f
);

const persistConfig = {
	key: "WahParty",
	storage: storageSession,
	whitelist: ["event"],
	blacklist:[]

};

const persistedReducers = persistReducer(persistConfig, rootReducer);
export const store = createStore(persistedReducers, enhancer);
export const persistor = persistStore(store);

