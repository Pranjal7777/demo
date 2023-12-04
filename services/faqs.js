import { get } from "../lib/request";
import { getCookie } from "../lib/session";

export const getFaqs = async (userType) => {
  return get(`/faq?userType=${userType}`);
};

export const getSubFaqs = async (id) => {
  return get(`/faq?parentId=${id}`);
};

export const getFaqContent = async (id) => {
  let lang = getCookie("language");
  return get(`/faq/content?faqId=${id}&lan=${lang}`);
};
