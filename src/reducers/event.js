import * as types from "actions/types";
import initialState from "./initialState";
import { mergeDeep } from "helpers/utils";

export default function event(state = initialState.event, action) {
  switch (action.type) {
    case types.RESET_EVENT_DETAILS:
      return Object.assign({}, state, {
        catalogue: {
          data: {
            cities: [],
            services: [],
            snacks: [],
            meals: [],
            themes: [],
            loaded: false
          }
        }
      });
    case types.GET_EVENT_DETAILS:
      return mergeDeep({}, state, {
        catalogue: {
          data: {
            cities: action.value.cities,
            services: action.value.services,
            snacks: action.value.snacks,
            meals: action.value.meals,
            themes: action.value.themes,
            loaded: true
          }
        }
      });
    case types.GET_EVENT_SESSION:
      return mergeDeep({}, state, {
        userinfo: action.value
      });
    case types.GET_PARTY_DETAILS:
      return mergeDeep({}, state, {
        partydetails: action.value
      });
    default:
      return state;
  }
}
