
import * as types from "./types";
import Promise from 'promise-polyfill';
import {

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

export function fetchEventDetails() {
    const urlCities = getCities();
    const urlServices = getServices();
    const urlSnacks = getSnacks();
    const urlMeals = getMeals();
    const urlThemes = getThemes();
    const headers = () => ({
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'api-key': '2956fc5c-a8bc-41d1-acd3-03f4f36e537a',
        'mode': 'cors'
    });
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

