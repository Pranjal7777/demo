import * as actionTypes from "./actionTypes";

export const setSeoSettings = (data) => {
  return {
    type: actionTypes.SET_SEO_SETTINGS,
    payload: data,
  };
};
