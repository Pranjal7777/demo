import { get, post } from "../lib/request";

export const getBillingPlans = (data) => {
  let url = `/billing?billingType=${data.billingType}&offset=${data.offset}&limit=${data.limit}`
  if (data.userId) {
    url += `&userId=${data.userId}`
  }
  return get(url);
};

export const getSubscribedPlanData = (data) => {
  let url = `/subscription/activeplan`
  if (data.userId) {
    url += `&userId=${data.userId}`
  }
  return get(url);
};

export const cancelSubscribedPlan = async (data) => {
  return post(`/subscription/cancel`, data);
};

export const getBilingDetails = (orderId) => {
  return get(`/billing/detail?orderId=${orderId}`);
};
