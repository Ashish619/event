import * as types from "actions/types";
import initialState from "./initialState";
import { mergeDeep } from "helpers/utils";

export default function event(state = initialState.event, action) {
  switch (action.type) {
    case types.RESET_EVENT_DETAILS:
      return Object.assign({}, state, {
        ...initialState.event
      });
    case types.GET_EVENT_DETAILS:
      return mergeDeep({}, state, {
        catalogue: {
          loaded: true,
          data: {
            cities: action.value.cities,
            services: action.value.services,
            snacks:action.value.snacks,
            meals: action.value.meals,
            themes: action.value.themes
          }
        }
      });
    default:
      return state;
  }
}
