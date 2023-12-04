import { get, patchWithToken, post, postWithToken, putWithToken } from "../lib/request";


export const getAgencyDetails = () => {
  return get(`/agency/details`);
};
export const getEmployeeList = async (data) => {
  let url = `/agencyUser?limit=${data.limit || 10}&offset=${data.offset || 0}&action=${data.action}`
  if (data.searchText) {
    url = url + `&searchText=${data.searchText}`;
  }
  return get(url);
}
export const getCreatorRequestList = async (data) => {
  let url = `/agencyCreator?limit=${data.limit || 10}&offset=${data.offset || 0}&action=${data.action}&agencyId=${data.agencyId}`
  return get(url);
}
export const getTaxDetail = (countryCode) => {
  return get(`/taxFields?countryCode=${countryCode}`);
};
export const getStatusLog = (data) => {
  return get(`/agencyCreator/detail?agencyId=${data.agencyId}&creatorId=${data.creatorId}`);
};
export const getStatusEmployee = (data) => {
  return get(`/agencyUser/detail?agencyId=${data.agencyId}&agencyUserId=${data.agencyUserId}`);
};
export const getCreatorLinkedList = (data) => {
  return get(`/agencyUser/linkedCreator?limit=${data.limit || 10}&offset=${data.offset || 0}`);
};
export const addEmployee = (data) => {
  return post(`/agencyUser`, data);
};
export const registerAgency = (data) => {
  return post(`/agency`, data);
};
export const updateAgencyProfile = (data) => {
  return patchWithToken(`/agency`, data);
};
export const updateEmployee = (data) => {
  return patchWithToken(`/agencyUser`, data);
};

export const updateStatus = (data) => {
  return putWithToken("/agencyCreator", data);
};
export const updateStatusEmployee = (data) => {
  return putWithToken("/agencyUser", data);
};
export const updateEmployeeList = (data) => {
  return putWithToken("/agencyCreator/changeAgencyUser", data);
};

export const getDeviceLog = (data) => {
  return get(`/python/userDeviceLogs/?userId=${data.userId}&limit=${data.limit || 10}&set=${data.offset || 0}`);
}
