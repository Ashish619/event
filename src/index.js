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
import SignUp from "containers/SignUp";
import MyPartyHost from "containers/MyPartyHost";
import HostDetails from "containers/HostDetails";
import vendorDetails from "containers/vendorDetails";
import MyPartyVendor from "containers/MyPartyVendor";
import VendorEdit from "containers/VendorEdit";
import HostEdit from "containers/HostEdit";
import PlanParty from "containers/PlanParty";
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
                    <Route path='/signIn' component={SignIn} />
                    <Route path='/signUp' component={SignUp} />
                    <Route path='/bookParty' component={HostDetails} />
                    <Route path='/businessPartner' component={vendorDetails} />
                    <Route path='/MyPartyVendor' component={MyPartyVendor} />
                    <Route path='/vendorEdit' component={VendorEdit} />
                    <Route path='/MyPartyHost' component={MyPartyHost} />
                    <Route path='/HostEdit' component={HostEdit} />
                    <Route path='/PlanParty' component={PlanParty} />

                </Switch>
            </ConnectedRouter>
        </PersistGate>
    </Provider>, app
);

