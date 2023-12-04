import { get, post, putWithToken, deleteReq } from "../lib/request";

// New Payment Gateway Integration

export const getCardAPI = () => {
  return get("/card");
}

export const postCardAPI = (elemId) => {
  return post("/card", elemId);
}

// API to SET DEFAULT CARD
export const putCardAPI = (cardId) => {
  return putWithToken("/card", cardId);
}

export const deleteCardAPI = (id) => {
  return deleteReq("/card", id);
}
