
import { get, postWithToken } from "../lib/request";

export const getFollowees = async (userId, skip = 0, limit = 5, string, creatorId) => {
  let search = string ? `&searchText=${string}` : "";
  let user = userId ? `&userId=${userId}` : ``;
  let creator = creatorId ? `&creatorId=${creatorId}` : ``;
  return get(
    `/follow?offset=${skip}${user}&limit=${limit}${search}${creator}&trigger=FOLLOWER`
  );
};

export const getFollowing = async (userId, skip = 0, limit = 5, string, creatorId) => {
  let search = string ? `&searchText=${string}` : "";
  let user = userId ? `&userId=${userId}` : ``;
  let creator = creatorId ? `&creatorId=${creatorId}` : ``;
  return get(
    `/follow?offset=${skip}${user}&limit=${limit}${search}${creator}&trigger=FOLLOWING`
  );
};

export const getFollowFollowing = async (userId, skip = 0, limit = 10, string, filter, creatorId) => {
  let search = string ? `&searchText=${string}` : "";
  let user = userId ? `&userId=${userId}` : ``;
  let creator = creatorId ? `&creatorId=${creatorId}` : ``;
  return get(
    `/follow?offset=${skip}${user}&limit=${limit}${search}${creator}&trigger=${filter}`
  );
};

//post follow
export const follow = async (data) => {
  return postWithToken("/follow", data);
};

//post follow
export const unfollow = async (data) => {
  return postWithToken("/unfollow", data);
};

export const getAssets = async ({ userId, page, mediaType = 0, postType = 0, status = 1, sort = 0, creatorId = "" }, otherHeaders = {}) => {
  let user = userId ? `&userId=${userId}` : "";
  let appedUrl = "";
  if (mediaType) {
    appedUrl += `&mediaType=${mediaType}`;
  }
  if (postType) {
    appedUrl += `&postType=${postType}`;
  }
  if (creatorId) {
    appedUrl += `&creatorId=${creatorId}`
  }
  return get(`/assets/?page=${page}${user}&status=${status}${appedUrl}&sort=${sort}`, otherHeaders);
};

export const getProfile = async (userId, token, creatorId) => {
  let url = `/profile?userId=${userId}&status=1`

  if (creatorId) {
    url += `&creatorId=${creatorId}`
  }
  return get(url, { authorization: token });
};

export const getBlockedUsers = async ({ offset, limit, searchText, uid = "" }) => {
  let search = searchText ? `&searchText=${searchText}` : "";
  let userId = uid ? `&userId=${uid}` : "";
  // return get(`/user/blockList?limit=${limit}&offset=${offset}${search}`);
  return get(`/block/list?limit=${limit}&offset=${offset}${search}${userId}`);
};

export const getFollowCount = async (userId, token, IS_AGENCY) => {
  let url = `/follow/count`
  if (IS_AGENCY) {
    url += `?creatorId=${userId}`
  } else {
    url += `?userId=${userId}`
  }
  return get(url, { authorization: token });
};

export const getUserId = async (username, token) => {
  return get(`/seo/userdata?profile=${username}`, { authorization: token })
}

export const getLockedPost = async ({ limit, offset, token }) => {
  return get(`/posts/locked?limit=${limit}&offset=${offset}`, { authorization: token })
}
export const makeScheduledPostActive = async (data) => {
  return postWithToken(`/change-status/`, data)
}