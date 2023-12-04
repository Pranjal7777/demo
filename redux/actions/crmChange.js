import { AGENCY_DATA, CRM_CHANGE_SETTING, MY_AGENCY_DATA } from "./actionTypes";

export const changeCrmSetting = (data) => {
  return {
    type: CRM_CHANGE_SETTING,
    payload: data,
  };
};
export const getAgencyData = (data) => {
  return {
    type: AGENCY_DATA,
    payload: data,
  };
};
export const getMyAgencyData = (data) => {
  return {
    type: MY_AGENCY_DATA,
    payload: data,
  };
};
