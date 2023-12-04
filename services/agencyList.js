import { get, post, putWithToken } from "../lib/request";

export const getAgencyList = async (value) => {
  console.log(value, "value")
  let url = `/agency/listForCreator?offset=${value.offset}&limit=${value.limit}`
  if (value?.searchText) {
    url = url + "&searchText=" + value.searchText;
  }
  return get(url);
};
export const getMyAgencyList = async (value) => {
  let url = `/myAgencies?offset=${value.offset}&limit=${value.limit}`
  if (value?.searchText) {
    url = url + "&searchText=" + value.searchText;
  }
  return get(url);
};

export const sendAgencyRequest = async (data) => {
  return post(`/newCreatorRequest`, data);
}

export const updateStatusEmployee = (data) => {
  return putWithToken("/agencyCreator", data);
};
