import * as actionTypes from "./actionTypes";

export const getCards = (data) => {
  return {
    type: actionTypes.GET_CARDS,
    payload: data,
  };
};

export const getCardsSuccess = (data) => {
  return {
    type: actionTypes.GET_CARD_SUCCESS,
    payload: data,
  };
};

export const deleteCardsAction = (data) => {
  return {
    type: actionTypes.DELETE_CARD,
    payload: data,
  };
};
export const cardsList = (data) => {
  return {
    type: actionTypes.CARDS_LIST,
    payload: data,
  }
}
export const updateCardList = (data) => {
  return {
    type: actionTypes.UPDATE_CARDS_LIST,
    payload: data,
  }
}
