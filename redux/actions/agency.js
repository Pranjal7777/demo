import * as actionTypes from "./actionTypes";


export const getAgencyData = (data) => {
  return {
    type: actionTypes.AGENCY_PROFILE_DATA,
    payload: {
      ...data
    },
  };
};
export const getOwnerData = (data) => {
  return {
    type: actionTypes.AGENCY_OWNER_DATA,
    payload: {
      ...data
    },
  };
};
export const getCreatorData = (data) => {
  return {
    type: actionTypes.AGENCY_CREATOR_REQUEST,
    payload: [
      ...data
    ],
  };
};
export const getSelectedEmplyee = (data) => {
  return {
    type: actionTypes.SELECTED_EMPLOYEE,
    payload: data,
  };
};
export const getAgencyCreatorList = (data) => {
  return {
    type: actionTypes.CREATOR_AGENCY_DATA,
    payload: data,
  };
};
export const getEmployeeData = (data) => {
  return {
    type: actionTypes.EMPLOYEE_DATA,
    payload: data,
  };
};
export const getAllEmployeeData = (data) => {
  return {
    type: actionTypes.ALL_EMPLOYEE_DATA,
    payload: data,
  };
};
export const setSelectCreator = (data) => {
  return {
    type: actionTypes.SELECT_CREATOR,
    payload: data,
  };
};
export const updateEmployeeHandler = (data) => {
  return {
    type: actionTypes.UPDATE_EMPLOYEE_DATA,
    payload: data,
  };
};
export const updateCreatorHandler = (data) => {
  return {
    type: actionTypes.UPADTE_CREATOR_AGENCY_DATA,
    payload: data,
  };
};