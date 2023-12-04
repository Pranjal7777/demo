import { get, post } from "../lib/request";

export const getHashtagAPI = (data) => {
  let url = `/hashTag?offset=${data.offset || 0}&limit=${data.limit || 10}`

  if (data.hashtagName) {
    url = `${url}&searchText=${data.hashtagName}`
  }

  return get(url, {});
};

export const getHashtagPostsAPI = (data) => {
  return get(`/hashTag/posts?hashtag=${data.hashtag}&offset=${data.offset || 0}&limit=${data.limit || 10}`, {});
};

export const followHashtagAPI = (data) => {
  return post("/hashtag/follow", data);
};

export const getPopularHashtagsAPI = (data) => {
  let postLimit = data.mobileView ? 3 : 4;

  let url = `/popularHashTags/?set=${data.set || 0}&postLimit=${data.postLimit || postLimit}&limit=${data.limit || 10}`;

  if (data.searchValue) {
    url = url + `&hashtagName=${data.searchValue}`;
  }

  return get(url, {});
};

export const getRandomCreatorApi = () => {
  return get("/randomListOfCreator");
};

export const getRecentSearchAPI = () => {
  return get("/recentSearch/");
};

export const recentSearchAPI = (data) => {
  return post("/recentSearch/", data);
};

export const getHashtagsAPI = (payload) => {
  return get(`/assets/?hashtag=%23${payload.hashtag}&page=${payload.page}`, {});
}

export const getHashtagsAPIForExplore = (payload) => {
  return get(`/assets/?hashtag=%23${payload.hashtag}&page=${payload.page}&size=${payload.size}`, {});
}