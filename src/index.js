import 'whatwg-fetch';
import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

// Store
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./config/store";

// Routing
import createHistory from "history/createBrowserHistory";
import { Route, Switch } from "react-router";
import { ConnectedRouter } from "react-router-redux";

// Global container components
import Event from "containers/Event";
import SignIn from "containers/SignIn";
import PartyDetails from "containers/PartyDetails";
import vendorDetails from "containers/vendorDetails";

import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.css';
import "assets/styles/index.scss";


const history = createHistory();

const app = document.getElementById("event");
app && ReactDOM.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <ConnectedRouter history={history}>
                <Switch>
                    <Route exact path='/' component={Event} />
                    <Route path='/SignIn' component={SignIn} />
                    <Route path='/bookParty' component={PartyDetails} />
                    <Route path='/businessPartner' component={vendorDetails} />
                </Switch>
            </ConnectedRouter>
        </PersistGate>
    </Provider>, app
);

