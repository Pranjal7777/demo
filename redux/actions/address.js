import * as actionTypes from "./actionTypes";

export const getAddress = ({ id, loader } = {}) => {
  return {
    type: actionTypes.GETADDRESS,
    payload: {
      id: id,
      loader: loader,
    },
  };
};

export const addressSuccess = (data) => {
  return {
    type: actionTypes.GETADDRESS_SUCCESS,
    payload: {
      address: data,
    },
  };
};

export const deleteAddress = (id) => {
  return {
    type: actionTypes.DELETE_ADDRESS,
    payload: {
      id: id,
    },
  };
};
