
import * as types from "./types";
import Promise from 'promise-polyfill';
import {
    getPartyDetails,
    login,
    getCities,
    getServices,
    getSnacks,
    getMeals,
    getThemes
} from "config/api";

export function resetEmployee() {
    return dispatch => {
        dispatch({
            type: types.RESET_EVENT_DETAILS
        });
    };
}
const headers = () => ({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    'api-key': '2956fc5c-a8bc-41d1-acd3-03f4f36e537a',
    'mode': 'cors'
});

export function fetchPartyDetails(email, sessiontoken) {
    return function (dispatch) {
        const partyUrl = getPartyDetails(email);
        fetch(partyUrl, {
            method: 'GET',
            headers: { ...headers(), sessiontoken },
        }).then(function (response) {
            return response.json();
        }).then(response => {
            dispatch({
                type: types.GET_PARTY_DETAILS,
                value: response
            });
        }).catch(error => { console.log(error); });
    };
}


export function fetchUserDetails(username, password) {
    return function (dispatch) {
        const loginUrl = login();
        fetch(loginUrl, {
            method: 'POST',
            headers: headers(),
            body: JSON.stringify({ username, password })
        }).then(function (response) {
            return response.json();
        }).then(response => {
            dispatch({
                type: types.GET_EVENT_SESSION,
                value: response
            });
        }).catch(error => { console.log(error); });
    };
}


export function fetchEventDetails() {
    const urlCities = getCities();
    const urlServices = getServices();
    const urlSnacks = getSnacks();
    const urlMeals = getMeals();
    const urlThemes = getThemes();

    return function (dispatch) {
        Promise.all([
            fetch(urlCities, {
                method: 'GET',
                headers: headers()
            }).then(function (response) {
                return response.json();
            }),
            fetch(urlServices, {
                method: 'GET',
                headers: headers()
            }).then(function (response) {
                return response.json();
            }),
            fetch(urlSnacks, {
                method: 'GET',
                headers: headers()
            }).then(function (response) {
                return response.json();
            }),
            fetch(urlMeals, {
                method: 'GET',
                headers: headers()
            }).then(function (response) {
                return response.json();
            }),
            fetch(urlThemes, {
                method: 'GET',
                headers: headers()
            }).then(function (response) {
                return response.json();
            })
        ]).then(values => {
            dispatch({
                type: types.GET_EVENT_DETAILS,
                value: {
                    cities: values[0].map(item => ({ ...item, value: item.city, label: item.city, })),
                    services: values[1],
                    snacks: values[2],
                    meals: values[3],
                    themes: values[4].map(item => ({ ...item, value: item.theme, label: item.theme, }))
                }
            });
        }).catch(error => { console.log(error); });
    };
}

