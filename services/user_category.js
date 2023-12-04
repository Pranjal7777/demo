import { ParseToken } from "../lib/parsers/token-parser";
import { get } from "../lib/request";

// get banner
export const getBanner = () => {
  return get("/banner");
};

// get popular modals
export const getPopularModals = async (list = {}) => {
  let url = `/popularModels/?userId=${list?.userId}&limit=${
    list?.limit || 10
  }&skip=${list?.offset || 0}`;
  if (list?.searchText) {
    url = url + "&searchText=" + list.searchText;
  }
  return get(url);
};


// get categories
export const getCategories = async (list = {}) => {
  let url = `/group?limit=${
    list?.limit || 10
  }&offset=${list?.offset || 0}`;
  if (list?.searchText) {
    url = url + "&searchText=" + list.searchText;
  }
  return get(url);
};

// get user card according to categories
export const getUserCardCategories = async (list = {}) => {
  let url = `/group/creator?limit=${
    list?.limit || 10
  }&offset=${list?.offset || 0}`;
  if (list?.searchText) {
    url = url + "&searchText=" + list.searchText;
  }
  if(list?.groupId){
    url = url + "&groupId=" + list.groupId;
  }
  return get(url);
};

// home page data API
export const getHompageData = async (list = {}, token) => {
  let url = `/homePage?offset=${list?.offset || 0}&limit=${
    list?.limit || 10}`
  if (token) {
    let headers = {
      authorization: await ParseToken(token),
    };
    return get(url, headers);
  }
  return get(url);
};

// pdp page data
export const getPdpPageData = async (list = {}) => {
  let url = `/homePage/details?offset=${list?.offset || 0}&limit=${
    list?.limit || 10}`
    if(list?.sectionId){
      url = url + "&sectionId=" + list.sectionId;
    }
    if(list?.searchText){
      url = url + "&searchText=" + list.searchText;
    }
    if(list?.sortBy){
      url = url + "&sortBy="+ list?.sortBy
    }
    if(list?.priceFrom && list?.priceTo){
      url = url + "&priceFrom="+ list?.priceFrom+"&priceTo="+ list?.priceTo
    }
    if(list?.shoutoutFrom && list?.shoutoutTo){
      url = url + "&shoutoutFrom="+ list?.shoutoutFrom+"&shoutoutTo="+ list?.shoutoutTo
    }
    if(list?.rating){
      url = url + "&rating="+ list.rating
    }
    if(list?.categoryIds){
      url = url + "&categoryIds="+ list.categoryIds
    }

  return get(url);
}

// pdp page data
export const getCategorySectionData = async (list = {}) => {
  let url = `/group/creator?offset=${list?.offset || 0}&limit=${
    list?.limit || 10}`
    if(list?.sortBy){
      url = url + "&sortBy="+ list?.sortBy
    }
    if(list?.priceFrom && list?.priceTo){
      url = url + "&priceFrom="+ list?.priceFrom+"&priceTo="+ list?.priceTo
    }
    if(list?.rating){
      url = url + "&rating="+ list.rating
    }
    if(list?.shoutoutFrom && list?.shoutoutTo){
      url = url + "&shoutoutFrom="+ list?.shoutoutFrom+"&shoutoutTo="+ list?.shoutoutTo
    }
    if((list?.categoryIds) != 0){
      url = url + "&categoryIds="+ list.categoryIds
    }

  return get(url);
}

// get categories
export const getCategoriesData = async (list) => {
  let url = `/group?offset=${list?.offset || 0}&limit=${
    list?.limit || 20}`
    if(list?.searchText){
      url = url + "&searchText="+ list.searchText
    }
  return get(url);
}
