import {
  deleteReq,
  deleteReqPayload,
  get,
  patchWithToken,
  postWithToken,
} from "../lib/request";

export const addCollection = (data) => {
  return postWithToken("/collection", data);
};

export const updateCollection = (data) => {
  return patchWithToken("/collection", data);
};

export const getCollection = (offset = 0, limit = 10, collectionId = "", userId = "") => {
  let appedsKeys = "";
  let userIds = "";
  if (collectionId) {
    appedsKeys = `&collectionId=${collectionId}`;
  }
  if (userId) {
    userIds = `&creatorId=${userId}`;
  }
  return get(`/collection?limit=${limit}&offset=${offset}${appedsKeys}${userIds}`);
};

export const getIndividuleData = (collectionId = "", creatorId = "") => {
  let appedsKeys = "";
  let creatorIds = "";
  if (collectionId) {
    appedsKeys = `&collectionId=${collectionId}`;
  }
  if (creatorId) {
    creatorIds = `&creatorId=${creatorId}`;
  }
  return get(`/collection?limit=${1}&offset=0${appedsKeys}${creatorIds}`);
};

export const deleteCollection = (collectionId) => {
  return deleteReq(
    `/collection?collectionId=${collectionId}&isCollection=true`
  );
};

export const bookmarkPost = (data) => {
  return postWithToken("/bookmark", data);
};

export const remveBookmarkPost = ({
  postIds,
  collectionId,
  isFromCollection = false,
  userId = ""
}) => {
  let payload = {
    postIds: postIds,
    isCollection: isFromCollection,
  }
  if (collectionId) {
    payload.collectionId = collectionId;
  }
  if (userId) {
    payload["userId"] = userId;
  }
  
  return deleteReqPayload(`/bookmark`, payload);
};

export const getBookmarkPosts = ({ offset, collectionId, limit, userId }) => {
  let appedsKeys = "";
  let userIds = "";
  if (collectionId) {
    appedsKeys = `&collectionId=${collectionId}`;
  }
  if (userId) {
    userIds = `&creatorId=${userId}`;
  }
  return get(`/posts/bookmark?limit=${limit}&offset=${offset}${appedsKeys}${userIds}`);
};
