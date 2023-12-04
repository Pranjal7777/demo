import { get, post, patch, deleteReq } from "../lib/request";

export const getSubscriptionPlansApi = (list = {}) => {
  return get(
    `/user/subscriptionPlan?limit=${list.limit || 10}&offset=${list.offset || 0
    }`,
    {}
  );
  // return get(`/user/subscriptionPlan?limit=${list.limit || 10}&offset=${list.offset || 0}`)
};

export const purchaseSubcriptionApi = (data) => {
  return post("/subscription", data);
};

export const validatePromocodeApi = (list = {}) => {
  return get(
    `/promoCode/validate?promoCode=${list.promoCode}&subscriptionPlanId=${list.subscriptionPlanId}`
  );
};

// Get All Plans
export const getAllPlans = (params) => {
  let url = "/subscriptionSettings";
  // if (params) {
  //   url = `${url}?isFilter=${params.isFilter}`
  // }
  if (params.userId) {
    url = `${url}?userId=${params.userId}`
  }
  return get(url);
};

// Post Selected Plan
export const selectSubscriptionPlanApi = (data) => {
  return post("/creator/subscriptionPlan", data);
};

// Get Selected Plan
export const getSelectedPlans = (userId) => {
  return get(`/creator/subscriptionPlan?userId=${userId}`);
};

// Update Selected Plan
export const updateSubscriptionPlanApi = (data) => {
  return patch("/creator/subscriptionPlan", data);
};

// Delete Selected Plan
export const deleteSubscriptionPlanApi = (payload) => {
  let url = `/creator/subscriptionPlan?subscriptionPlanId=${payload.planId}`
  if (payload.userId) {
    url = `${url}&userId=${payload.userId}`;
  }
  return deleteReq(url);
};

// Active/Cancelled Plans
export const getSubscriptions = (queryData) => {
  let url = `/mySubscriptions?status=${queryData.status}&offset=${queryData.offset || 0}&limit=${queryData.limit || 20}`

  if (queryData.searchText) {
    url = `${url}&searchText=${queryData.searchText}`
  }
  if (queryData.userId) {
    url = `${url}&userId=${queryData.userId}`
  }
  return get(url, {});
};

// To Cancel Active Plan
export const cancelActivePlan = (formData) => {
  return post(`/subscription/cancel`, formData);
};

// GET Subscribers
export const getMySubscribers = (queryData) => {
  let url = `/mySubscribers?offset=${queryData.offset || 0}&limit=${queryData.limit || 20}`

  if (queryData.planId) {
    url = `${url}&planId=${queryData.planId}`
  } else if (queryData.searchText) {
    url = `${url}&searchText=${queryData.searchText}`
  }
  if (queryData.userId) {
    url = `${url}&userId=${queryData.userId}`
  }

  return get(url, {});
};

// Renew Subscription Plan
export const renewSubscription = (formData) => {
  return post(`/subscription/renew`, formData);
};