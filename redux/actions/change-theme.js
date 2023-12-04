import * as actionTypes from "./actionTypes";

export const changeCurrentTheme = (data) => {
  return {
    type: actionTypes.CHANGE_THEME,
    payload: data,
  };
};
