import { get } from "../lib/request";
import { getCookie } from "../lib/session";

export const getSuggetions = (search = "", limit = 10, offset = 0) => {
  return get(
    `/models/search?searchText=${search}&limit=${limit}&offset=${offset}`
  );
};

export const getPopularSearch = (limit = 10, offset = 0) => {
  let appendUrl = "";
  const uid = getCookie("uid");
  if (uid) {
    appendUrl = "&userId=" + uid;
  }
  return get(`/popularModels/?limit=${limit}&skip=${offset}${appendUrl}`);
};

export const getExploreSearch = (page = 1) => {
  return get(`/explorePosts/?page=${page}&limit=20`);
};
