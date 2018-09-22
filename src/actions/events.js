
import * as types from "./types";

import Promise from 'promise-polyfill';
import {
    getPartyDetails,
    login,
    getCities,
    getServices,
    getSnacks,
    getMeals,
    getThemes,
    registerVendor,
    getLogout,
    getParty,
    updateVendor,
    updateParty,
    forgetPassword,
    registeHost,
    updateHost,
    planParty,
    updatePartyIdHost
} from "config/api";

export function resetEmployee() {
    return dispatch => {
        dispatch({
            type: types.RESET_EVENT_DETAILS
        });
    };
}
const headers = () => ({
    "Access-Control-Allow-Origin": "http://api.wahparty.com/v1",
    'Access-Control-Allow-Credentials': 'true',
    "Content-Type": "application/json",
    'mode': 'cors',
    'api-key': '2956fc5c-a8bc-41d1-acd3-03f4f36e537a',
});

const openHeader = () => ({
    "Access-Control-Allow-Origin": "http://api.wahparty.com/v1",
    "Content-Type": "application/json",
    'mode': 'cors',
    'api-key': '2956fc5c-a8bc-41d1-acd3-03f4f36e537a',
});



export function resetPassword(mail) {
    const forgetPasswordUrl = forgetPassword();
    return fetch(forgetPasswordUrl, {
        method: 'PUT',
        headers: { ...openHeader() },
        credentials: 'include',
        body: JSON.stringify({ 'username': mail })
    });

}




export function logout(sessiontoken) {

    const logoutUrl = getLogout();
    fetch(logoutUrl, {
        method: 'POST',
        headers: { ...headers(), sessiontoken },
        credentials: 'include',
    }).then(function (response) {
        return response.json();
    }).then(res => { window.sessionStorage.clear(); window.location.href = "/signIn"; })
        .catch(error => { console.log(error); });
}



export function fetchPartyDetails(email, sessiontoken) {
    return function (dispatch) {
        const partyUrl = getPartyDetails(email);
        fetch(partyUrl, {
            method: 'GET',
            headers: { ...headers(), sessiontoken },
            credentials: 'include'
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

export function getPartyByID(id, sessiontoken) {
    const partyUrl = getParty(id);
    return fetch(partyUrl, {
        method: 'GET',
        headers: { ...headers(), sessiontoken },
        credentials: 'include'
    });

}


export function getVendorDetails(vemail, sessiontoken) {

    const updateVendorUrl = updateVendor(vemail);
    return fetch(updateVendorUrl, {
        method: 'GET',
        headers: { ...headers(), sessiontoken },
        credentials: 'include'
    });

}

export function getHostDetails(vemail, sessiontoken) {

    const updateHostUrl = updateHost(vemail);
    return fetch(updateHostUrl, {
        method: 'GET',
        headers: { ...headers(), sessiontoken },
        credentials: 'include'
    });

}

export function registerVendorDetails(vendorinfo) {
    const registerVendorUrl = registerVendor();
    return fetch(registerVendorUrl, {
        method: 'POST',
        headers: openHeader(),
        body: JSON.stringify(vendorinfo)
    })
        .then(function (response) {
            return response.json();
        }).catch(error => { console.log(error); });

}

export function registerHostDetails(userinfo) {
    const registeHostUrl = registeHost();
    return fetch(registeHostUrl, {
        method: 'POST',
        headers: openHeader(),
        body: JSON.stringify(userinfo)
    })
        .then(function (response) {
            return response.json();
        }).then(res => { window.location.href = "/signIn"; }).catch(error => { console.log(error); });

}



export function updateVendorDetails(vendorinfo, sessiontoken, email) {
    console.log(vendorinfo);
    const updateVendorUrl = updateVendor(email);
    return fetch(updateVendorUrl, {
        method: 'PUT',
        headers: { ...headers(), sessiontoken },
        credentials: 'include',
        body: JSON.stringify(vendorinfo)
    })
        .then(function (response) {
            return response.json();
        }).then(res => { window.location.href = "/MyPartyVendor"; }).catch(error => { console.log(error); });

}



export function planPartyHost(userinfo, sessiontoken) {

    const planPartyUrl = planParty();
    return fetch(planPartyUrl, {
        method: 'POST',
        headers: { ...headers(), sessiontoken },
        credentials: 'include',
        body: JSON.stringify(userinfo)
    })
        .then(function (response) {
            return response.json();
        }).then(res => {
            window.location.href = "/MyPartyHost";
        }
        ).catch(error => { console.log(error); });

}

export function updatePartyHost(id,partyinfo, sessiontoken) {

    const updatePartyUrl = updatePartyIdHost(id);
    return fetch(updatePartyUrl, {
        method: 'PUT',
        headers: { ...headers(), sessiontoken },
        credentials: 'include',
        body: JSON.stringify(partyinfo)
    })
        .then(function (response) {
            return response.json();
        }).then(res => {
            window.location.href = "/MyPartyHost";
        }
        ).catch(error => { console.log(error); });

}


export function updateHostDetails(userinfo, sessiontoken, email) {

    const updateHostUrl = updateHost(email);
    return fetch(updateHostUrl, {
        method: 'PUT',
        headers: { ...headers(), sessiontoken },
        credentials: 'include',
        body: JSON.stringify(userinfo)
    })
        .then(function (response) {
            return response.json();
        }).then(res => { window.location.href = "/MyPartyHost"; }).catch(error => { console.log(error); });

}



export function updatePartyStatus(sessiontoken, partyid, state) {
    const updatePartyUrl = updateParty(partyid, state);
    return fetch(updatePartyUrl, {
        method: 'PATCH',
        headers: { ...headers(), sessiontoken },
        credentials: 'include'
    });

}


export function fetchUserDetails(username, password) {
    return function (dispatch) {
        const loginUrl = login();
        fetch(loginUrl, {
            method: 'POST',
            headers: headers(),
            credentials: 'include',
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
                headers: openHeader()
            }).then(function (response) {
                return response.json();
            }),
            fetch(urlServices, {
                method: 'GET',
                headers: openHeader()
            }).then(function (response) {
                return response.json();
            }),
            fetch(urlSnacks, {
                method: 'GET',
                headers: openHeader()
            }).then(function (response) {
                return response.json();
            }),
            fetch(urlMeals, {
                method: 'GET',
                headers: openHeader()
            }).then(function (response) {
                return response.json();
            }),
            fetch(urlThemes, {
                method: 'GET',
                headers: openHeader()
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

